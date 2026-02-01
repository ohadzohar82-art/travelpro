'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { Plus, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'
import type { Database } from '@/types/database'

type Client = Database['public']['Tables']['clients']['Row']

export default function ClientsPage() {
  const { user } = useAuthStore()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', notes: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadClients()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const loadClients = async () => {
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
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (currentUser?.agency_id) {
        query = query.eq('agency_id', currentUser.agency_id)
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
      }

      const { data, error } = await query

      if (error) {
        if (error.message?.includes('schema cache') || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.warn('Database table may not exist yet:', error.message)
          toast.error('טבלת הלקוחות לא קיימת. אנא צור את הטבלאות ב-Supabase.')
        } else {
          throw error
        }
      }
      setClients(data || [])
    } catch (error: any) {
      console.error('Error loading clients:', error)
      toast.error(error.message || 'שגיאה בטעינת לקוחות')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClient = async () => {
    if (!newClient.name.trim()) {
      toast.error('אנא הזן שם לקוח')
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()
      
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
      
      if (!currentUser?.agency_id) {
        throw new Error('לא נמצא agency_id')
      }

      const { data, error } = await supabase
        .from('clients')
        .insert({
          agency_id: currentUser.agency_id,
          name: newClient.name,
          email: newClient.email || null,
          phone: newClient.phone || null,
          notes: newClient.notes || null,
        })
        .select()
        .single()

      if (error) {
        if (error.message?.includes('schema cache') || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          toast.error('טבלת הלקוחות לא קיימת. אנא צור את הטבלאות ב-Supabase.')
        } else {
          throw error
        }
        return
      }

      toast.success('לקוח נוצר בהצלחה!')
      setShowModal(false)
      setNewClient({ name: '', email: '', phone: '', notes: '' })
      loadClients()
    } catch (error: any) {
      console.error('Error creating client:', error)
      toast.error(error.message || 'שגיאה ביצירת לקוח')
    } finally {
      setSaving(false)
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
        <Button onClick={() => setShowModal(true)}>
          <Plus className="ml-2 h-4 w-4" />
          לקוח חדש
        </Button>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="לקוח חדש"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">שם לקוח *</label>
            <Input
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              placeholder="שם מלא"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">אימייל</label>
            <Input
              type="email"
              value={newClient.email}
              onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">טלפון</label>
            <Input
              type="tel"
              value={newClient.phone}
              onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
              placeholder="050-1234567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">הערות</label>
            <Input
              value={newClient.notes}
              onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
              placeholder="הערות נוספות"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreateClient} disabled={saving} className="flex-1">
              {saving ? 'יוצר...' : 'צור לקוח'}
            </Button>
            <Button variant="ghost" onClick={() => setShowModal(false)} disabled={saving}>
              ביטול
            </Button>
          </div>
        </div>
      </Modal>

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
            <Button onClick={() => setShowModal(true)}>צור לקוח ראשון</Button>
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
