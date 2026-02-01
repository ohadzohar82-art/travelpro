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
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        
        // Give cookies time to be available after redirect
        await new Promise(resolve => setTimeout(resolve, 200))
        
        // Try multiple times to get session (cookies might not be ready immediately)
        let session = null
        let authUser = null
        let attempts = 0
        const maxAttempts = 5
        
        while (attempts < maxAttempts && !session && !authUser) {
          // First try getSession (uses cookies)
          const { data: { session: sessionData }, error: sessionError } = await supabase.auth.getSession()
          
          if (sessionData && sessionData.user && !sessionError) {
            session = sessionData
            authUser = sessionData.user
            break
          }
          
          // If no session, try getUser (might have token)
          const { data: { user: userData }, error: userError } = await supabase.auth.getUser()
          
          if (userData && !userError) {
            authUser = userData
            break
          }
          
          // Wait before retry
          if (attempts < maxAttempts - 1) {
            await new Promise(resolve => setTimeout(resolve, 300))
          }
          attempts++
        }
        
        // If we still don't have a user after retries, redirect
        if (!authUser) {
          console.log('No authenticated user found after retries, redirecting to login')
          router.push('/login')
          return
        }
        
        // We have a user, fetch their data
        if (!user || user.id !== authUser.id) {
          await loadUserData(supabase, authUser.id)
        } else {
          loadStats(user)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        // Only redirect on actual errors, not just missing session
        if (error instanceof Error && error.message.includes('JWT')) {
          router.push('/login')
        } else {
          // For other errors, try to continue
          console.log('Non-critical auth error, continuing...')
          setLoading(false)
        }
      }
    }
    
    const loadUserData = async (supabase: ReturnType<typeof createClient>, userId: string) => {
      const { data: userDataArray, error: userError } = await supabase
        .from('users')
        .select('*, agencies(*)')
        .eq('id', userId)
      
      if (userError || !userDataArray || userDataArray.length === 0) {
        console.error('Failed to load user data:', userError)
        router.push('/login')
        return
      }
      
      const userData = userDataArray[0]
      setUser(userData)
      const agencyData = Array.isArray(userData.agencies) 
        ? userData.agencies[0] 
        : userData.agencies
      setAgency(agencyData)
      loadStats(userData)
    }
    
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadStats = async (currentUser = user) => {
    if (!currentUser) return
    
    try {
      const supabase = createClient()
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
        revenue_this_month: totalRevenue, // Simplified for now
      })
    } catch (error) {
      console.error('Error loading stats:', error)
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
      <div>
        <h1 className="text-3xl font-bold">לוח בקרה</h1>
        <p className="text-gray-500 mt-2">ברוך הבא, {user?.full_name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה&quot;כ חבילות</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_packages}</div>
            <p className="text-xs text-muted-foreground">כל החבילות</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">לקוחות</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_clients}</div>
            <p className="text-xs text-muted-foreground">לקוחות פעילים</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה&quot;כ הכנסות</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('he-IL', {
                style: 'currency',
                currency: agency?.default_currency || 'USD',
              }).format(stats.total_revenue)}
            </div>
            <p className="text-xs text-muted-foreground">כל הזמנים</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">הכנסות החודש</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('he-IL', {
                style: 'currency',
                currency: agency?.default_currency || 'USD',
              }).format(stats.revenue_this_month)}
            </div>
            <p className="text-xs text-muted-foreground">החודש הנוכחי</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>סטטוס חבילות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>טיוטא</span>
                <span className="font-semibold">{stats.packages_by_status.draft}</span>
              </div>
              <div className="flex justify-between">
                <span>נשלח</span>
                <span className="font-semibold">{stats.packages_by_status.sent}</span>
              </div>
              <div className="flex justify-between">
                <span>אושר</span>
                <span className="font-semibold">{stats.packages_by_status.confirmed}</span>
              </div>
              <div className="flex justify-between">
                <span>בוטל</span>
                <span className="font-semibold">{stats.packages_by_status.cancelled}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
