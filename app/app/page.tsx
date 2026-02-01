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
      console.log('=== DASHBOARD AUTH CHECK START ===')
      
      try {
        const supabase = createClient()
        
        // Wait longer for cookies to propagate after redirect
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Try multiple times - cookies might not be ready immediately
        let foundUser = false
        for (let attempt = 0; attempt < 10; attempt++) {
          console.log(`Auth check attempt ${attempt + 1}/10`)
          
          const { data: { session }, error: sessionError } = await supabase.auth.getSession()
          console.log('getSession:', { hasSession: !!session, hasUser: !!session?.user, error: sessionError?.message })
          
          if (session?.user) {
            console.log('✅ Session found!', session.user.id)
            await loadUserData(supabase, session.user.id)
            foundUser = true
            break
          }
          
          const { data: { user: authUser }, error: userError } = await supabase.auth.getUser()
          console.log('getUser:', { hasUser: !!authUser, error: userError?.message })
          
          if (authUser) {
            console.log('✅ User found via getUser!', authUser.id)
            await loadUserData(supabase, authUser.id)
            foundUser = true
            break
          }
          
          // Wait before next attempt
          if (attempt < 9) {
            await new Promise(resolve => setTimeout(resolve, 500))
          }
        }
        
        if (!foundUser) {
          console.error('❌ No user found after all attempts')
          router.push('/login')
        }
        
      } catch (error) {
        console.error('=== DASHBOARD AUTH ERROR ===', error)
        // Don't redirect on error - might be temporary
        setLoading(false)
      }
    }
    
    const loadUserData = async (supabase: ReturnType<typeof createClient>, userId: string) => {
      console.log('Loading user data for:', userId)
      
      const { data: userDataArray, error: userError } = await supabase
        .from('users')
        .select('*, agencies(*)')
        .eq('id', userId)
      
      if (userError) {
        console.error('Failed to load user data:', userError)
        router.push('/login')
        return
      }
      
      if (!userDataArray || userDataArray.length === 0) {
        console.error('No user data found')
        router.push('/login')
        return
      }
      
      const userData = userDataArray[0]
      setUser(userData)
      const agencyData = Array.isArray(userData.agencies) 
        ? userData.agencies[0] 
        : userData.agencies
      setAgency(agencyData)
      
      console.log('User data loaded, loading stats...')
      loadStats(userData)
    }
    
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadStats = async (currentUser = user) => {
    if (!currentUser) {
      setLoading(false)
      return
    }
    
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
        revenue_this_month: totalRevenue,
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
