'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'
import { Loader } from '@/components/ui/loader'
import type { Database } from '@/types/database'

type Template = Database['public']['Tables']['templates']['Row']

export default function TemplatesPage() {
  const { user } = useAuthStore()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newTemplate, setNewTemplate] = useState({ name: '', description: '', duration_days: 7 })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadTemplates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadTemplates = async () => {
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
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (currentUser?.agency_id) {
        query = query.eq('agency_id', currentUser.agency_id)
      }
      
      const { data, error } = await query

      if (error) {
        if (error.message?.includes('schema cache') || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.warn('Database table may not exist yet:', error.message)
          toast.error('טבלת התבניות לא קיימת. אנא צור את הטבלאות ב-Supabase.')
        } else {
          throw error
        }
      }
      setTemplates(data || [])
    } catch (error: any) {
      console.error('Error loading templates:', error)
      toast.error(error.message || 'שגיאה בטעינת תבניות')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTemplate = async () => {
    if (!newTemplate.name.trim()) {
      toast.error('אנא הזן שם תבנית')
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
        .from('templates')
        .insert({
          agency_id: currentUser.agency_id,
          name: newTemplate.name,
          description: newTemplate.description || null,
          duration_days: newTemplate.duration_days,
          usage_count: 0,
        })
        .select()
        .single()

      if (error) {
        if (error.message?.includes('schema cache') || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          toast.error('טבלת התבניות לא קיימת. אנא צור את הטבלאות ב-Supabase.')
        } else {
          throw error
        }
        return
      }

      toast.success('תבנית נוצרה בהצלחה!')
      setShowModal(false)
      setNewTemplate({ name: '', description: '', duration_days: 7 })
      loadTemplates()
    } catch (error: any) {
      console.error('Error creating template:', error)
      toast.error(error.message || 'שגיאה ביצירת תבנית')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">תבניות</h1>
          <p className="text-gray-500 mt-2">נהל את התבניות שלך</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="ml-2 h-4 w-4" />
          תבנית חדשה
        </Button>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="תבנית חדשה"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">שם תבנית *</label>
            <Input
              value={newTemplate.name}
              onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
              placeholder="חבילת תאילנד קלאסית"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">תיאור</label>
            <Input
              value={newTemplate.description}
              onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
              placeholder="תיאור התבנית"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">מספר ימים</label>
            <Input
              type="number"
              value={newTemplate.duration_days}
              onChange={(e) => setNewTemplate({ ...newTemplate, duration_days: parseInt(e.target.value) || 7 })}
              min="1"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreateTemplate} disabled={saving} className="flex-1">
              {saving ? 'יוצר...' : 'צור תבנית'}
            </Button>
            <Button variant="ghost" onClick={() => setShowModal(false)} disabled={saving}>
              ביטול
            </Button>
          </div>
        </div>
      </Modal>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">אין תבניות עדיין</p>
            <Button onClick={() => setShowModal(true)}>צור תבנית ראשונה</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                {template.description && (
                  <p className="text-gray-600 mb-2">{template.description}</p>
                )}
                {template.duration_days && (
                  <p className="text-sm text-gray-500">
                    {template.duration_days} ימים
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  שימוש: {template.usage_count} פעמים
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
