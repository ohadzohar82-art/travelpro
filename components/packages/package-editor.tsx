'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Save, Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'
import { DaysTimeline } from './days-timeline'
import { ItemTypesPalette } from './item-types-palette'
import { PriceSummary } from './price-summary'
import type { Database } from '@/types/database'

type Package = Database['public']['Tables']['packages']['Row']
type PackageDay = Database['public']['Tables']['package_days']['Row']
type PackageItem = Database['public']['Tables']['package_items']['Row']

export function PackageEditor({ packageId }: { packageId: string }) {
  const router = useRouter()
  const { user, setUser, setAgency } = useAuthStore()
  const [pkg, setPkg] = useState<Package | null>(null)
  const [days, setDays] = useState<PackageDay[]>([])
  const [items, setItems] = useState<PackageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      // Load user from session if not in store
      if (!user) {
        try {
          const supabase = createClient()
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            const { data: userDataArray } = await supabase
              .from('users')
              .select('*, agencies(*)')
              .eq('id', session.user.id)
            if (userDataArray && userDataArray.length > 0) {
              const userData = userDataArray[0]
              setUser(userData)
              const agencyData = Array.isArray(userData.agencies) 
                ? userData.agencies[0] 
                : userData.agencies
              setAgency(agencyData)
            }
          }
        } catch (error) {
          console.error('Error loading user:', error)
        }
      }
      
      if (packageId) {
        await loadPackage()
      }
    }
    
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageId])

  const loadPackage = async () => {
    try {
      const supabase = createClient()
      
      // Get current user (from store or session)
      let currentUser = user
      if (!currentUser) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: userDataArray } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          if (userDataArray) {
            currentUser = userDataArray
          }
        }
      }

      if (!currentUser?.agency_id) {
        console.error('No user or agency_id found')
        const errorMsg = 'שגיאה: לא נמצא מזהה סוכנות. אנא התחבר מחדש.'
        setError(errorMsg)
        toast.error(errorMsg)
        setLoading(false)
        return
      }

      // Load package - try without agency_id first to see if it exists
      const { data: pkgData, error: pkgError } = await supabase
        .from('packages')
        .select('*')
        .eq('id', packageId)
        .single()

      if (pkgError) {
        console.error('Package load error:', pkgError)
        let errorMsg = 'שגיאה בטעינת החבילה'
        if (pkgError.message?.includes('schema cache') || pkgError.message?.includes('relation') || pkgError.message?.includes('does not exist')) {
          errorMsg = 'טבלת החבילות לא קיימת. אנא צור את הטבלאות ב-Supabase.'
        } else if (pkgError.code === 'PGRST116') {
          errorMsg = 'חבילה לא נמצאה. ייתכן שהיא נמחקה או שאין לך הרשאה לצפות בה.'
        } else {
          errorMsg = `שגיאה בטעינת החבילה: ${pkgError.message || pkgError.code || 'שגיאה לא ידועה'}`
        }
        setError(errorMsg)
        toast.error(errorMsg)
        setLoading(false)
        return
      }

      if (!pkgData) {
        const errorMsg = 'חבילה לא נמצאה'
        setError(errorMsg)
        toast.error(errorMsg)
        setLoading(false)
        return
      }

      // Check if user has access to this package
      if (pkgData.agency_id !== currentUser.agency_id) {
        const errorMsg = 'אין לך הרשאה לצפות בחבילה זו'
        setError(errorMsg)
        toast.error(errorMsg)
        setTimeout(() => router.push('/app/packages'), 2000)
        setLoading(false)
        return
      }

      setPkg(pkgData)

      // Load days
      const { data: daysData, error: daysError } = await supabase
        .from('package_days')
        .select('*')
        .eq('package_id', packageId)
        .order('day_number', { ascending: true })

      if (daysError) {
        console.error('Days load error:', daysError)
        // Don't fail completely if days can't load
        setDays([])
      } else {
        setDays(daysData || [])
      }

      // Load items
      const { data: itemsData, error: itemsError } = await supabase
        .from('package_items')
        .select('*')
        .eq('package_id', packageId)
        .order('sort_order', { ascending: true })

      if (itemsError) {
        console.error('Items load error:', itemsError)
        // Don't fail completely if items can't load
        setItems([])
      } else {
        setItems(itemsData || [])
      }
    } catch (error: any) {
      console.error('Unexpected error loading package:', error)
      const errorMsg = error.message || 'שגיאה בטעינת החבילה'
      setError(errorMsg)
      toast.error(errorMsg)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!pkg) return

    setSaving(true)
    try {
      const supabase = createClient()

      // Update package
      const { error: pkgError } = await supabase
        .from('packages')
        .update({
          title: pkg.title,
          description: pkg.description,
          start_date: pkg.start_date,
          end_date: pkg.end_date,
          client_name: pkg.client_name,
          client_email: pkg.client_email,
          client_phone: pkg.client_phone,
          adults: pkg.adults,
          children: pkg.children,
          infants: pkg.infants,
        })
        .eq('id', packageId)

      if (pkgError) throw pkgError

      toast.success('נשמר בהצלחה!')
    } catch (error: any) {
      toast.error(error.message || 'שגיאה בשמירה')
    } finally {
      setSaving(false)
    }
  }

  const handleAddDay = async () => {
    if (!pkg || !pkg.id || !pkg.agency_id) {
      toast.error('חבילה לא תקינה')
      return
    }

    try {
      const supabase = createClient()
      const dayNumber = (days?.length || 0) + 1

      const { data, error } = await supabase
        .from('package_days')
        .insert({
          package_id: pkg.id,
          agency_id: pkg.agency_id,
          day_number: dayNumber,
          title: `יום ${dayNumber}`,
        })
        .select()
        .single()

      if (error) throw error

      setDays([...days, data])
      toast.success('יום נוסף בהצלחה!')
    } catch (error: any) {
      toast.error(error.message || 'שגיאה בהוספת יום')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">טוען...</div>
      </div>
    )
  }

  if (!pkg && !loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-lg font-semibold text-gray-900 mb-2">
              {error || 'חבילה לא נמצאה'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {error?.includes('טבלאות') 
                ? 'אנא צור את הטבלאות ב-Supabase באמצעות הקובץ COMPLETE_DATABASE_SETUP.sql'
                : 'החבילה לא קיימת, נמחקה, או שאין לך הרשאה לצפות בה.'}
            </p>
            <Button onClick={() => router.push('/app/packages')}>
              חזור לרשימת החבילות
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Safety check - ensure pkg has required properties
  if (!pkg || !pkg.id || !pkg.agency_id) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">שגיאה: נתוני החבילה לא תקינים</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Input
            value={pkg?.title || ''}
            onChange={(e) => setPkg({ ...pkg, title: e.target.value } as Package)}
            className="text-2xl font-bold border-0 p-0 focus-visible:ring-0"
            placeholder="שם החבילה"
          />
          <div className="flex items-center gap-2 mt-2">
            {pkg.status && (
              <Badge variant={(pkg.status as any) || 'draft'}>{pkg.status}</Badge>
            )}
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="ml-2 h-4 w-4" />
          {saving ? 'שומר...' : 'שמור'}
        </Button>
      </div>

      {/* Package Info */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">שם לקוח</label>
              <Input
                value={pkg.client_name || ''}
                onChange={(e) => setPkg({ ...pkg, client_name: e.target.value })}
                placeholder="שם הלקוח"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">אימייל</label>
              <Input
                type="email"
                value={pkg.client_email || ''}
                onChange={(e) => setPkg({ ...pkg, client_email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">טלפון</label>
              <Input
                value={pkg.client_phone || ''}
                onChange={(e) => setPkg({ ...pkg, client_phone: e.target.value })}
                placeholder="050-1234567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">תאריכים</label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={pkg.start_date || ''}
                  onChange={(e) => setPkg({ ...pkg, start_date: e.target.value })}
                />
                <Input
                  type="date"
                  value={pkg.end_date || ''}
                  onChange={(e) => setPkg({ ...pkg, end_date: e.target.value })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Days Timeline */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">ימים</h2>
            <Button onClick={handleAddDay} size="sm">
              <Plus className="ml-2 h-4 w-4" />
              הוסף יום
            </Button>
          </div>
          {pkg && (
            <DaysTimeline
              days={days || []}
              items={items || []}
              packageId={packageId}
              onDaysChange={setDays}
              onItemsChange={setItems}
              currency={pkg.currency || 'USD'}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {pkg && (
            <>
              <ItemTypesPalette packageId={packageId} days={days || []} />
              <PriceSummary items={items || []} currency={pkg.currency || 'USD'} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
