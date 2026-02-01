'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import type { Database } from '@/types/database'

type Country = Database['public']['Tables']['countries']['Row']

export default function CountriesPage() {
  const { user } = useAuthStore()
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCountries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadCountries = async () => {
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
        .from('countries')
        .select('*')
        .order('name', { ascending: true })
      
      if (currentUser?.agency_id) {
        query = query.eq('agency_id', currentUser.agency_id)
      }
      
      const { data, error } = await query

      if (error) throw error
      setCountries(data || [])
    } catch (error) {
      console.error('Error loading countries:', error)
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">מדינות</h1>
          <p className="text-gray-500 mt-2">נהל את המדינות שלך</p>
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          מדינה חדשה
        </Button>
      </div>

      {countries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">אין מדינות עדיין</p>
            <Button>צור מדינה ראשונה</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {countries.map((country) => (
            <Card key={country.id}>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{country.name}</h3>
                {country.name_en && (
                  <p className="text-gray-600 mb-2">{country.name_en}</p>
                )}
                <p className="text-sm text-gray-500">קוד: {country.code}</p>
                <p className="text-sm text-gray-500">מטבע: {country.currency}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
