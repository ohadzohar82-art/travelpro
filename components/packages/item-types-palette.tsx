'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Database } from '@/types/database'

type PackageDay = Database['public']['Tables']['package_days']['Row']

const itemTypes = [
  { type: 'flight', icon: '✈️', label: 'טיסה', color: '#3B82F6' },
  { type: 'accommodation', icon: '🏨', label: 'לינה', color: '#8B5CF6' },
  { type: 'transfer', icon: '🚗', label: 'העברה', color: '#F59E0B' },
  { type: 'activity', icon: '🎯', label: 'פעילות', color: '#10B981' },
  { type: 'meal', icon: '🍽️', label: 'ארוחה', color: '#F97316' },
  { type: 'transition', icon: '🔄', label: 'מעבר', color: '#EC4899' },
  { type: 'free_time', icon: '⏰', label: 'זמן חופשי', color: '#6B7280' },
  { type: 'custom', icon: '⭐', label: 'מותאם', color: '#6366F1' },
]

interface ItemTypesPaletteProps {
  packageId: string
  days: PackageDay[]
}

export function ItemTypesPalette({ packageId, days }: ItemTypesPaletteProps) {
  const handleAddItem = async (type: string, dayId: string) => {
    if (days.length === 0) {
      toast.error('אנא הוסף יום קודם')
      return
    }

    try {
      const supabase = createClient()

      // Get the day's items count for sort_order
      const { data: existingItems } = await supabase
        .from('package_items')
        .select('sort_order')
        .eq('day_id', dayId)
        .order('sort_order', { ascending: false })
        .limit(1)

      const sortOrder = existingItems && existingItems.length > 0 ? existingItems[0].sort_order + 1 : 0

      const { data: day } = await supabase
        .from('package_days')
        .select('agency_id')
        .eq('id', dayId)
        .single()

      const { data, error } = await supabase
        .from('package_items')
        .insert({
          day_id: dayId,
          package_id: packageId,
          agency_id: day.agency_id,
          type: type as any,
          title: itemTypes.find((t) => t.type === type)?.label || 'פריט חדש',
          sort_order: sortOrder,
          price: 0,
          price_per: 'total',
          is_included: true,
          is_optional: false,
          data: {},
        })
        .select()
        .single()

      if (error) throw error

      toast.success('פריט נוסף בהצלחה!')
      window.location.reload() // Simple refresh for now
    } catch (error: any) {
      toast.error(error.message || 'שגיאה בהוספת פריט')
    }
  }

  if (days.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>סוגי פריטים</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">הוסף יום קודם כדי להוסיף פריטים</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>סוגי פריטים</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {itemTypes.map((itemType) => (
          <div key={itemType.type} className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
              <span className="text-xl">{itemType.icon}</span>
              <span className="flex-1 text-sm font-medium">{itemType.label}</span>
            </div>
            <div className="mr-6 space-y-1">
              {days.map((day) => (
                <button
                  key={day.id}
                  onClick={() => handleAddItem(itemType.type, day.id)}
                  className="w-full text-right text-xs text-primary hover:underline py-1"
                >
                  + הוסף ליום {day.day_number}
                </button>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
