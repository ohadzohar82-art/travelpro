'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Filter } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import { formatDate } from '@/lib/utils'
import type { Database } from '@/types/database'

type Package = Database['public']['Tables']['packages']['Row']

export default function PackagesPage() {
  const { user } = useAuthStore()
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    if (user) {
      loadPackages()
    }
  }, [user, statusFilter])

  const loadPackages = async () => {
    try {
      const supabase = createClient()
      let query = supabase
        .from('packages')
        .select('*')
        .eq('agency_id', user?.agency_id)
        .order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      if (search) {
        query = query.ilike('title', `%${search}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setPackages(data || [])
    } catch (error) {
      console.error('Error loading packages:', error)
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
            <Link key={pkg.id} href={`/app/packages/${pkg.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
