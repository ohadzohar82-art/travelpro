'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { formatDate, formatCurrency } from '@/lib/utils'
import Image from 'next/image'
import type { Database } from '@/types/database'

type Package = Database['public']['Tables']['packages']['Row']
type PackageDay = Database['public']['Tables']['package_days']['Row']
type PackageItem = Database['public']['Tables']['package_items']['Row']
type Agency = Database['public']['Tables']['agencies']['Row']

type PackageWithRelations = Package & {
  agencies?: Agency
  package_days?: (PackageDay & {
    package_items?: PackageItem[]
  })[]
}

export default function PublicPackageView() {
  const params = useParams()
  const token = params?.token as string
  const [pkg, setPkg] = useState<PackageWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      loadPackage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const loadPackage = async () => {
    try {
      const supabase = createClient()
      
      // Load package by public_token
      const { data: pkgData, error: pkgError } = await supabase
        .from('packages')
        .select(`
          *,
          agencies (*)
        `)
        .eq('public_token', token)
        .single()

      if (pkgError) {
        if (pkgError.code === 'PGRST116') {
          setError('חבילה לא נמצאה או שהקישור לא תקין')
        } else {
          setError('שגיאה בטעינת החבילה')
        }
        setLoading(false)
        return
      }

      // Check if token is expired
      if (pkgData.public_expires_at && new Date(pkgData.public_expires_at) < new Date()) {
        setError('קישור זה פג תוקף')
        setLoading(false)
        return
      }

      // Load days and items
      const { data: daysData } = await supabase
        .from('package_days')
        .select(`
          *,
          package_items (*)
        `)
        .eq('package_id', pkgData.id)
        .order('day_number', { ascending: true })

      setPkg({
        ...pkgData,
        package_days: daysData || [],
      } as PackageWithRelations)
    } catch (error: any) {
      console.error('Error loading package:', error)
      setError('שגיאה בטעינת החבילה')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">טוען...</div>
      </div>
    )
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">שגיאה</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{error || 'חבילה לא נמצאה'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const agency = Array.isArray(pkg.agencies) ? pkg.agencies[0] : pkg.agencies
  const days = pkg.package_days || []

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header with Agency Branding */}
      {agency && (
        <div 
          className="bg-white border-b-4 shadow-sm"
          style={{ borderBottomColor: agency.primary_color || '#2563eb' }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {agency.logo_url && (
                  <Image
                    src={agency.logo_url}
                    alt={agency.name}
                    width={120}
                    height={40}
                    className="object-contain"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: agency.primary_color || '#2563eb' }}>
                    {agency.name}
                  </h1>
                  {agency.contact_phone && (
                    <p className="text-sm text-gray-600">טלפון: {agency.contact_phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Package Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">{pkg.title}</CardTitle>
                {pkg.description && (
                  <p className="text-gray-600 mt-2">{pkg.description}</p>
                )}
              </div>
              <Badge 
                variant={
                  pkg.status === 'confirmed' ? 'confirmed' :
                  pkg.status === 'sent' ? 'sent' :
                  pkg.status === 'cancelled' ? 'cancelled' :
                  'draft'
                }
              >
                {pkg.status === 'confirmed' ? 'אושר' :
                 pkg.status === 'sent' ? 'נשלח' :
                 pkg.status === 'cancelled' ? 'בוטל' :
                 'טיוטא'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {pkg.start_date && pkg.end_date && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">תאריכים</h3>
                  <p className="text-gray-600">
                    {formatDate(pkg.start_date)} - {formatDate(pkg.end_date)}
                  </p>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">משתתפים</h3>
                <p className="text-gray-600">
                  {pkg.adults} מבוגרים
                  {pkg.children > 0 && `, ${pkg.children} ילדים`}
                  {pkg.infants > 0 && `, ${pkg.infants} תינוקות`}
                </p>
              </div>
              {pkg.client_name && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">לקוח</h3>
                  <p className="text-gray-600">{pkg.client_name}</p>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">מחיר כולל</h3>
                <p className="text-2xl font-bold" style={{ color: agency?.primary_color || '#2563eb' }}>
                  {formatCurrency(pkg.total_price || 0, pkg.currency || 'ILS')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Days Timeline */}
        {days.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">תוכנית הטיול</h2>
            {days.map((day) => (
              <Card key={day.id}>
                <CardHeader>
                  <CardTitle className="text-xl">
                    יום {day.day_number}: {day.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {day.package_items && day.package_items.length > 0 ? (
                    <div className="space-y-4">
                      {day.package_items
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((item) => (
                          <div key={item.id} className="border-r-4 pr-4" style={{ borderRightColor: agency?.primary_color || '#2563eb' }}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg">{item.title}</h4>
                                {item.subtitle && (
                                  <p className="text-gray-600 mt-1">{item.subtitle}</p>
                                )}
                                {item.description && (
                                  <p className="text-gray-500 text-sm mt-2">{item.description}</p>
                                )}
                                {item.time_start && (
                                  <p className="text-sm text-gray-500 mt-2">
                                    {item.time_start}
                                    {item.time_end && ` - ${item.time_end}`}
                                  </p>
                                )}
                              </div>
                              {item.price && item.price > 0 && (
                                <div className="text-left">
                                  <p className="font-semibold">
                                    {formatCurrency(item.price, pkg.currency || 'ILS')}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-4">אין פריטים ביום זה</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Client Notes */}
        {pkg.client_notes && (
          <Card className="mt-6 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg">הערות</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{pkg.client_notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        {agency && (
          <div className="mt-8 pt-6 border-t text-center text-gray-500 text-sm">
            {agency.contact_email && (
              <p>אימייל: {agency.contact_email}</p>
            )}
            {agency.website && (
              <p>אתר: {agency.website}</p>
            )}
            {agency.address && (
              <p>כתובת: {agency.address}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
