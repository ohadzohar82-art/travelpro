'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import type { Database } from '@/types/database'

type Destination = Database['public']['Tables']['destinations']['Row']
type Country = Database['public']['Tables']['countries']['Row']

// Type for destination with joined country
type DestinationWithCountry = Destination & {
  countries?: Country | Country[] | null
}

export default function DestinationsPage() {
  const { user } = useAuthStore()
  const [destinations, setDestinations] = useState<DestinationWithCountry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadDestinations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadDestinations = async () => {
    try {
      const supabase = createClient()
      let query = supabase
        .from('destinations')
        .select('*, countries(*)')
        .order('name', { ascending: true })

      if (user?.agency_id) {
        query = query.eq('agency_id', user.agency_id)
      }

      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setDestinations((data as DestinationWithCountry[]) || [])
    } catch (error) {
      console.error('Error loading destinations:', error)
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
          <h1 className="text-3xl font-bold">יעדים</h1>
          <p className="text-gray-500 mt-2">נהל את כל היעדים שלך</p>
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          יעד חדש
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="חיפוש יעדים..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              loadDestinations()
            }}
            className="pr-10"
          />
        </div>
      </div>

      {destinations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">אין יעדים עדיין</p>
            <Button>צור יעד ראשון</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <Card key={destination.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{destination.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {destination.countries && (
                  <p className="text-sm text-gray-500">
                    מדינה: {Array.isArray(destination.countries) 
                      ? destination.countries[0]?.name 
                      : destination.countries?.name}
                  </p>
                )}
                {destination.description && (
                  <p className="text-sm text-gray-600 mt-2">{destination.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
