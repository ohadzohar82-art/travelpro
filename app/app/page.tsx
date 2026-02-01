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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">לוח בקרה</h1>
        <p className="text-lg text-gray-600">ברוך הבא{user?.full_name ? `, ${user.full_name}` : ''}</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="border-2 border-blue-100 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">סה&quot;כ חבילות</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900 mb-1">{stats.total_packages}</div>
            <p className="text-sm text-gray-600 font-medium">כל החבילות</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100 bg-gradient-to-br from-white to-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">לקוחות</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-green-500 flex items-center justify-center shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900 mb-1">{stats.total_clients}</div>
            <p className="text-sm text-gray-600 font-medium">לקוחות פעילים</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">סה&quot;כ הכנסות</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-purple-500 flex items-center justify-center shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {new Intl.NumberFormat('he-IL', {
                style: 'currency',
                currency: agency?.default_currency || 'USD',
              }).format(stats.total_revenue)}
            </div>
            <p className="text-sm text-gray-600 font-medium">כל הזמנים</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">הכנסות החודש</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {new Intl.NumberFormat('he-IL', {
                style: 'currency',
                currency: agency?.default_currency || 'USD',
              }).format(stats.revenue_this_month)}
            </div>
            <p className="text-sm text-gray-600 font-medium">החודש הנוכחי</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 border-gray-200">
          <CardHeader className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="text-xl font-bold text-gray-900">סטטוס חבילות</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
                <span className="text-gray-800 font-semibold text-base">טיוטא</span>
                <span className="text-2xl font-bold text-blue-600">{stats.packages_by_status.draft}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-100 hover:bg-yellow-100 transition-colors">
                <span className="text-gray-800 font-semibold text-base">נשלח</span>
                <span className="text-2xl font-bold text-yellow-600">{stats.packages_by_status.sent}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100 hover:bg-green-100 transition-colors">
                <span className="text-gray-800 font-semibold text-base">אושר</span>
                <span className="text-2xl font-bold text-green-600">{stats.packages_by_status.confirmed}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition-colors">
                <span className="text-gray-800 font-semibold text-base">בוטל</span>
                <span className="text-2xl font-bold text-red-600">{stats.packages_by_status.cancelled}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
