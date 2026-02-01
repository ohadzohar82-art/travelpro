'use client'

import { Card, CardContent } from '@/components/ui/card'
import { DayCard } from './day-card'
import type { Database } from '@/types/database'

type PackageDay = Database['public']['Tables']['package_days']['Row']
type PackageItem = Database['public']['Tables']['package_items']['Row']

interface DaysTimelineProps {
  days: PackageDay[]
  items: PackageItem[]
  packageId: string
  onDaysChange: (days: PackageDay[]) => void
  onItemsChange: (items: PackageItem[]) => void
}

export function DaysTimeline({
  days,
  items,
  packageId,
  onDaysChange,
  onItemsChange,
}: DaysTimelineProps) {
  if (days.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500 mb-4">אין ימים עדיין</p>
          <p className="text-sm text-gray-400">הוסף יום ראשון כדי להתחיל</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {days.map((day) => {
        const dayItems = items.filter((item) => item.day_id === day.id)
        return (
          <DayCard
            key={day.id}
            day={day}
            items={dayItems}
            packageId={packageId}
            onUpdate={(updatedDay) => {
              onDaysChange(days.map((d) => (d.id === day.id ? updatedDay : d)))
            }}
            onDelete={() => {
              onDaysChange(days.filter((d) => d.id !== day.id))
            }}
            onItemsChange={(updatedItems) => {
              const otherItems = items.filter((item) => item.day_id !== day.id)
              onItemsChange([...otherItems, ...updatedItems])
            }}
          />
        )
      })}
    </div>
  )
}
