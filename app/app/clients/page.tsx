'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import type { Database } from '@/types/database'

type Client = Database['public']['Tables']['clients']['Row']

export default function ClientsPage() {
  const { user } = useAuthStore()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (user) {
      loadClients()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, search])

  const loadClients = async () => {
    try {
      const supabase = createClient()
      let query = supabase
        .from('clients')
        .select('*')
        .eq('agency_id', user?.agency_id)
        .order('created_at', { ascending: false })

      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setClients(data || [])
    } catch (error) {
      console.error('Error loading clients:', error)
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
          <h1 className="text-3xl font-bold">לקוחות</h1>
          <p className="text-gray-500 mt-2">נהל את הלקוחות שלך</p>
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          לקוח חדש
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="search"
          placeholder="חיפוש לקוחות..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-10"
        />
      </div>

      {clients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">אין לקוחות עדיין</p>
            <Button>צור לקוח ראשון</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {clients.map((client) => (
            <Card key={client.id}>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{client.name}</h3>
                {client.email && <p className="text-gray-600 mb-1">{client.email}</p>}
                {client.phone && <p className="text-gray-600 mb-1">{client.phone}</p>}
                {client.notes && (
                  <p className="text-sm text-gray-500 mt-2">{client.notes}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
