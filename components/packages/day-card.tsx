'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash2, GripVertical } from 'lucide-react'
import { ItemCard } from './item-card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Database } from '@/types/database'

type PackageDay = Database['public']['Tables']['package_days']['Row']
type PackageItem = Database['public']['Tables']['package_items']['Row']

interface DayCardProps {
  day: PackageDay
  items: PackageItem[]
  packageId: string
  onUpdate: (day: PackageDay) => void
  onDelete: () => void
  onItemsChange: (items: PackageItem[]) => void
  currency?: string
}

export function DayCard({ day, items, packageId, onUpdate, onDelete, onItemsChange, currency = 'USD' }: DayCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(day?.title || '')
  
  if (!day || !day.id) {
    return null
  }

  const handleSave = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('package_days')
        .update({ title })
        .eq('id', day.id)
        .select()
        .single()

      if (error) throw error
      onUpdate(data)
      setIsEditing(false)
    } catch (error: any) {
      toast.error(error.message || 'שגיאה בעדכון יום')
    }
  }

  const handleDelete = async () => {
    if (!confirm('האם אתה בטוח שברצונך למחוק יום זה?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from('package_days').delete().eq('id', day.id)

      if (error) throw error
      onDelete()
      toast.success('יום נמחק בהצלחה!')
    } catch (error: any) {
      toast.error(error.message || 'שגיאה במחיקת יום')
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <GripVertical className="h-5 w-5 text-gray-400" />
          {isEditing ? (
            <div className="flex-1 flex gap-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave()
                }}
                autoFocus
              />
            </div>
          ) : (
            <>
              <h3
                className="flex-1 text-lg font-semibold cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                יום {day?.day_number || 0}: {day?.title || ''}
              </h3>
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        <div className="space-y-2">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              אין פריטים ביום זה. גרור פריטים מהסרגל הצדדי
            </div>
          ) : (
            items
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onUpdate={(updatedItem) => {
                    onItemsChange(
                      items.map((i) => (i.id === item.id ? updatedItem : i))
                    )
                  }}
                  onDelete={() => {
                    onItemsChange(items.filter((i) => i.id !== item.id))
                  }}
                  currency={currency}
                />
              ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
