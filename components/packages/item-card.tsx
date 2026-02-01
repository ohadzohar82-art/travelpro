'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, GripVertical } from 'lucide-react'
import { ItemForm } from './item-form'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Database } from '@/types/database'

type PackageItem = Database['public']['Tables']['package_items']['Row']

const itemTypeIcons: Record<string, string> = {
  flight: '✈️',
  accommodation: '🏨',
  transfer: '🚗',
  activity: '🎯',
  meal: '🍽️',
  transition: '🔄',
  free_time: '⏰',
  custom: '⭐',
}

const itemTypeLabels: Record<string, { he: string; en: string }> = {
  flight: { he: 'טיסה', en: 'Flight' },
  accommodation: { he: 'לינה', en: 'Accommodation' },
  transfer: { he: 'העברה', en: 'Transfer' },
  activity: { he: 'פעילות', en: 'Activity' },
  meal: { he: 'ארוחה', en: 'Meal' },
  transition: { he: 'מעבר', en: 'Transition' },
  free_time: { he: 'זמן חופשי', en: 'Free Time' },
  custom: { he: 'מותאם', en: 'Custom' },
}

interface ItemCardProps {
  item: PackageItem
  onUpdate: (item: PackageItem) => void
  onDelete: () => void
  currency?: string
}

export function ItemCard({ item, onUpdate, onDelete, currency = 'USD' }: ItemCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  
  if (!item || !item.id) {
    return null
  }

  const handleDelete = async () => {
    if (!confirm('האם אתה בטוח שברצונך למחוק פריט זה?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from('package_items').delete().eq('id', item.id)

      if (error) throw error
      onDelete()
      toast.success('פריט נמחק בהצלחה!')
    } catch (error: any) {
      toast.error(error.message || 'שגיאה במחיקת פריט')
    }
  }

  if (isEditing) {
    return (
      <ItemForm
        item={item}
        onSave={(updatedItem) => {
          onUpdate(updatedItem)
          setIsEditing(false)
        }}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{itemTypeIcons[item.type] || '⭐'}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold">{item?.title || 'פריט ללא שם'}</h4>
              <Badge variant="default" className="text-xs">
                {item?.type ? (itemTypeLabels[item.type]?.he || item.type) : 'לא ידוע'}
              </Badge>
            </div>
            {item?.subtitle && <p className="text-sm text-gray-600 mb-2">{item.subtitle}</p>}
            {item?.time_start && (
              <p className="text-xs text-gray-500">
                {item.time_start}
                {item?.time_end && ` - ${item.time_end}`}
              </p>
            )}
            {(item?.price || 0) > 0 && (
              <p className="text-sm font-semibold mt-2">
                {new Intl.NumberFormat('he-IL', {
                  style: 'currency',
                  currency: currency,
                }).format(item.price || 0)}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(true)
              }}
              className="hover:bg-blue-50 hover:text-blue-600"
              title="ערוך"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation()
                handleDelete()
              }}
              className="hover:bg-red-50 hover:text-red-600"
              title="מחק"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
