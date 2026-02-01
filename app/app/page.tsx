'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Users, DollarSign, TrendingUp, Globe, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Database } from '@/types/database'

type Country = Database['public']['Tables']['countries']['Row']
type Destination = Database['public']['Tables']['destinations']['Row']

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
  const [recentCountries, setRecentCountries] = useState<Country[]>([])
  const [recentDestinations, setRecentDestinations] = useState<Destination[]>([])

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

        // Load recent countries and destinations
        const { data: countriesData } = await supabase
          .from('countries')
          .select('*')
          .eq('agency_id', currentUser.agency_id)
          .order('created_at', { ascending: false })
          .limit(6)

        const { data: destinationsData } = await supabase
          .from('destinations')
          .select('*')
          .eq('agency_id', currentUser.agency_id)
          .order('created_at', { ascending: false })
          .limit(6)

        setRecentCountries(countriesData || [])
        setRecentDestinations(destinationsData || [])
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
          <div className="flex items-center gap-4 mb-4">
            {agency?.logo_url && (
              <div className="relative h-16 w-48">
                <Image
                  src={agency.logo_url}
                  alt={agency.name || 'Logo'}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">לוח בקרה</h1>
              <p className="text-lg text-gray-600">ברוך הבא{user?.full_name ? `, ${user.full_name}` : ''}</p>
            </div>
          </div>
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

      {/* Recent Countries and Destinations */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Countries */}
        <Card className="border-2 border-gray-200">
          <CardHeader className="border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-white flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              מדינות אחרונות
            </CardTitle>
            <Link href="/app/countries" className="text-sm text-blue-600 hover:underline">
              צפה בכל
            </Link>
          </CardHeader>
          <CardContent className="p-6">
            {recentCountries.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Globe className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>אין מדינות עדיין</p>
                <Link href="/app/countries">
                  <button className="mt-4 text-blue-600 hover:underline">הוסף מדינה ראשונה</button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-2">
                {recentCountries.map((country) => (
                  <Link key={country.id} href="/app/countries">
                    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                      {country.image_url ? (
                        <div className="relative w-full h-32">
                          <Image
                            src={country.image_url}
                            alt={country.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="relative w-full h-32 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                          <span className="text-4xl">🌍</span>
                        </div>
                      )}
                      <CardContent className="p-3">
                        <h4 className="font-semibold text-sm truncate">{country.name}</h4>
                        {country.code && (
                          <p className="text-xs text-gray-500">{country.code}</p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Destinations */}
        <Card className="border-2 border-gray-200">
          <CardHeader className="border-b-2 border-gray-200 bg-gradient-to-r from-purple-50 to-white flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              יעדים אחרונים
            </CardTitle>
            <Link href="/app/destinations" className="text-sm text-purple-600 hover:underline">
              צפה בכל
            </Link>
          </CardHeader>
          <CardContent className="p-6">
            {recentDestinations.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>אין יעדים עדיין</p>
                <Link href="/app/destinations">
                  <button className="mt-4 text-purple-600 hover:underline">הוסף יעד ראשון</button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-2">
                {recentDestinations.map((destination) => (
                  <Link key={destination.id} href="/app/destinations">
                    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                      {destination.image_url ? (
                        <div className="relative w-full h-32">
                          <Image
                            src={destination.image_url}
                            alt={destination.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="relative w-full h-32 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                          <span className="text-4xl">🏖️</span>
                        </div>
                      )}
                      <CardContent className="p-3">
                        <h4 className="font-semibold text-sm truncate">{destination.name}</h4>
                        {destination.region && (
                          <p className="text-xs text-gray-500">{destination.region}</p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
