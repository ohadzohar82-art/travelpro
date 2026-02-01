'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Users, DollarSign, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const { user, agency, setUser, setAgency } = useAuthStore()
  const [stats, setStats] = useState({
    total_packages: 0,
    packages_by_status: { draft: 0, sent: 0, confirmed: 0, cancelled: 0 },
    total_clients: 0,
    total_revenue: 0,
    revenue_this_month: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TEMPORARY: Skip auth check, just load dashboard
    console.log('Dashboard loading (auth disabled)')
    
    // Try to load user if available, but don't require it
    const loadData = async () => {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // User is logged in, load their data
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
            loadStats(userData)
            return
          }
        }
        
        // No user or not logged in - show dashboard with empty stats
        setLoading(false)
      } catch (error) {
        console.error('Error loading data:', error)
        setLoading(false)
      }
    }
    
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadStats = async (currentUser = user) => {
    try {
      const supabase = createClient()
      
      if (currentUser?.agency_id) {
        const { data: packages } = await supabase
          .from('packages')
          .select('status, total_price')
          .eq('agency_id', currentUser.agency_id)

        const { data: clients } = await supabase
          .from('clients')
          .select('id')
          .eq('agency_id', currentUser.agency_id)

        const packagesByStatus = {
          draft: packages?.filter((p) => p.status === 'draft').length || 0,
          sent: packages?.filter((p) => p.status === 'sent').length || 0,
          confirmed: packages?.filter((p) => p.status === 'confirmed').length || 0,
          cancelled: packages?.filter((p) => p.status === 'cancelled').length || 0,
        }

        const totalRevenue = packages?.reduce((sum, p) => sum + (p.total_price || 0), 0) || 0

        setStats({
          total_packages: packages?.length || 0,
          packages_by_status: packagesByStatus,
          total_clients: clients?.length || 0,
          total_revenue: totalRevenue,
          revenue_this_month: totalRevenue,
        })
      } else {
        // No user - show empty stats
        setStats({
          total_packages: 0,
          packages_by_status: { draft: 0, sent: 0, confirmed: 0, cancelled: 0 },
          total_clients: 0,
          total_revenue: 0,
          revenue_this_month: 0,
        })
      }
    } catch (error) {
      console.error('Error loading stats:', error)
      // Show empty stats on error
      setStats({
        total_packages: 0,
        packages_by_status: { draft: 0, sent: 0, confirmed: 0, cancelled: 0 },
        total_clients: 0,
        total_revenue: 0,
        revenue_this_month: 0,
      })
    } finally {
      setLoading(false)
    }
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">לוח בקרה</h1>
        <p className="text-gray-500 mt-2">ברוך הבא{user?.full_name ? `, ${user.full_name}` : ''}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600">סה&quot;כ חבילות</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.total_packages}</div>
            <p className="text-xs text-gray-500 mt-1">כל החבילות</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600">לקוחות</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.total_clients}</div>
            <p className="text-xs text-gray-500 mt-1">לקוחות פעילים</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600">סה&quot;כ הכנסות</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {new Intl.NumberFormat('he-IL', {
                style: 'currency',
                currency: agency?.default_currency || 'USD',
              }).format(stats.total_revenue)}
            </div>
            <p className="text-xs text-gray-500 mt-1">כל הזמנים</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600">הכנסות החודש</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {new Intl.NumberFormat('he-IL', {
                style: 'currency',
                currency: agency?.default_currency || 'USD',
              }).format(stats.revenue_this_month)}
            </div>
            <p className="text-xs text-gray-500 mt-1">החודש הנוכחי</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-lg">סטטוס חבילות</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">טיוטא</span>
                <span className="text-xl font-bold text-gray-900">{stats.packages_by_status.draft}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">נשלח</span>
                <span className="text-xl font-bold text-gray-900">{stats.packages_by_status.sent}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">אושר</span>
                <span className="text-xl font-bold text-gray-900">{stats.packages_by_status.confirmed}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">בוטל</span>
                <span className="text-xl font-bold text-gray-900">{stats.packages_by_status.cancelled}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
