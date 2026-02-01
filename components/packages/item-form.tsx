'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Database } from '@/types/database'

type PackageItem = Database['public']['Tables']['package_items']['Row']

interface ItemFormProps {
  item: PackageItem
  onSave: (item: PackageItem) => void
  onCancel: () => void
}

export function ItemForm({ item, onSave, onCancel }: ItemFormProps) {
  const [formData, setFormData] = useState({
    title: item.title,
    subtitle: item.subtitle || '',
    description: item.description || '',
    time_start: item.time_start || '',
    time_end: item.time_end || '',
    duration: item.duration || '',
    price: item.price || 0,
    price_per: item.price_per || 'total',
    notes: item.notes || '',
    data: item.data || {},
  })

  const handleSave = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('package_items')
        .update({
          title: formData.title,
          subtitle: formData.subtitle,
          description: formData.description,
          time_start: formData.time_start,
          time_end: formData.time_end,
          duration: formData.duration,
          price: formData.price,
          price_per: formData.price_per as any,
          notes: formData.notes,
          data: formData.data,
        })
        .eq('id', item.id)
        .select()
        .single()

      if (error) throw error
      onSave(data)
      toast.success('פריט עודכן בהצלחה!')
    } catch (error: any) {
      toast.error(error.message || 'שגיאה בעדכון פריט')
    }
  }

  return (
    <Card className="border-2 border-primary">
      <CardContent className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">כותרת *</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">כותרת משנה</label>
          <Input
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">שעת התחלה</label>
            <Input
              type="time"
              value={formData.time_start}
              onChange={(e) => setFormData({ ...formData, time_start: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">שעת סיום</label>
            <Input
              type="time"
              value={formData.time_end}
              onChange={(e) => setFormData({ ...formData, time_end: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">מחיר</label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">הערות</label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            rows={3}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            שמור
          </Button>
          <Button variant="ghost" onClick={onCancel} className="flex-1">
            ביטול
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
