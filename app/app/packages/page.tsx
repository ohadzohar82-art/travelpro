'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import type { Database } from '@/types/database'

type Package = Database['public']['Tables']['packages']['Row']

export default function PackagesPage() {
  const { user } = useAuthStore()
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    // Load packages even if user is not in store yet
    loadPackages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  const loadPackages = async () => {
    try {
      const supabase = createClient()
      
      // Get user from session if not in store
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
      
      let query = supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (currentUser?.agency_id) {
        query = query.eq('agency_id', currentUser.agency_id)
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      if (search) {
        query = query.ilike('title', `%${search}%`)
      }

      const { data, error } = await query

      if (error) {
        if (error.message?.includes('schema cache') || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.warn('Database table may not exist yet:', error.message)
          // Don't show error toast on every load, just log it
        } else {
          throw error
        }
      }
      setPackages(data || [])
    } catch (error: any) {
      console.error('Error loading packages:', error)
      // Only show toast for non-table-missing errors
      if (!error.message?.includes('schema cache') && !error.message?.includes('relation') && !error.message?.includes('does not exist')) {
        toast.error(error.message || 'שגיאה בטעינת חבילות')
      }
    } finally {
      setLoading(false)
    }
  }

  const getStatusVariant = (status: string): 'draft' | 'sent' | 'confirmed' | 'cancelled' => {
    return status as 'draft' | 'sent' | 'confirmed' | 'cancelled'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'טיוטא',
      sent: 'נשלח',
      confirmed: 'אושר',
      cancelled: 'בוטל',
    }
    return labels[status] || status
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">טוען...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">חבילות</h1>
          <p className="text-gray-500 mt-2">נהל את כל החבילות שלך</p>
        </div>
        <Link href="/app/packages/new">
          <Button>
            <Plus className="ml-2 h-4 w-4" />
            חבילה חדשה
          </Button>
        </Link>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="חיפוש חבילות..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              loadPackages()
            }}
            className="pr-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="all">כל הסטטוסים</option>
          <option value="draft">טיוטא</option>
          <option value="sent">נשלח</option>
          <option value="confirmed">אושר</option>
          <option value="cancelled">בוטל</option>
        </select>
      </div>

      {packages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">אין חבילות עדיין</p>
            <Link href="/app/packages/new">
              <Button>צור חבילה ראשונה</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <Link href={`/app/packages/${pkg.id}`} className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{pkg.title}</h3>
                      <Badge variant={getStatusVariant(pkg.status)}>
                        {getStatusLabel(pkg.status)}
                      </Badge>
                    </div>
                    {pkg.client_name && (
                      <p className="text-gray-600 mb-2">לקוח: {pkg.client_name}</p>
                    )}
                    {pkg.start_date && pkg.end_date && (
                      <p className="text-sm text-gray-500">
                        {formatDate(pkg.start_date)} - {formatDate(pkg.end_date)}
                      </p>
                    )}
                    <p className="text-lg font-semibold mt-2">
                      {new Intl.NumberFormat('he-IL', {
                        style: 'currency',
                        currency: pkg.currency || 'USD',
                      }).format(pkg.total_price || 0)}
                    </p>
                  </Link>
                  <div className="flex gap-2 mr-4">
                    <Link href={`/app/packages/${pkg.id}`}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="hover:bg-blue-50 hover:text-blue-600"
                        title="ערוך"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={async (e) => {
                        e.preventDefault()
                        if (!confirm('האם אתה בטוח שברצונך למחוק חבילה זו?')) return
                        try {
                          const supabase = createClient()
                          const { error } = await supabase.from('packages').delete().eq('id', pkg.id)
                          if (error) throw error
                          toast.success('חבילה נמחקה בהצלחה!')
                          loadPackages()
                        } catch (error: any) {
                          toast.error(error.message || 'שגיאה במחיקת חבילה')
                        }
                      }}
                      className="hover:bg-red-50 hover:text-red-600"
                      title="מחק"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
