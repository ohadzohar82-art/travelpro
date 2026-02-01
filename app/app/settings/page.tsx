'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'
import type { Database } from '@/types/database'

type Agency = Database['public']['Tables']['agencies']['Row']

export default function SettingsPage() {
  const { agency, setAgency } = useAuthStore()
  const [formData, setFormData] = useState<Partial<Agency>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (agency) {
      setFormData(agency)
      setLoading(false)
    }
  }, [agency])

  const handleSave = async () => {
    if (!agency) return

    setSaving(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('agencies')
        .update(formData)
        .eq('id', agency.id)
        .select()
        .single()

      if (error) throw error
      setAgency(data)
      toast.success('הגדרות נשמרו בהצלחה!')
    } catch (error: any) {
      toast.error(error.message || 'שגיאה בשמירת הגדרות')
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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">הגדרות</h1>
        <p className="text-gray-500 mt-2">נהל את הגדרות הסוכנות שלך</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>פרטי סוכנות</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">שם הסוכנות</label>
            <Input
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">אימייל</label>
            <Input
              type="email"
              value={formData.contact_email || ''}
              onChange={(e) =>
                setFormData({ ...formData, contact_email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">טלפון</label>
            <Input
              value={formData.contact_phone || ''}
              onChange={(e) =>
                setFormData({ ...formData, contact_phone: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">WhatsApp</label>
            <Input
              value={formData.contact_whatsapp || ''}
              onChange={(e) =>
                setFormData({ ...formData, contact_whatsapp: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">כתובת</label>
            <Input
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">מטבע ברירת מחדל</label>
            <Input
              value={formData.default_currency || ''}
              onChange={(e) =>
                setFormData({ ...formData, default_currency: e.target.value })
              }
            />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'שומר...' : 'שמור הגדרות'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
