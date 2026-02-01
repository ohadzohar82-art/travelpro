'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Database } from '@/types/database'

type PackageItem = Database['public']['Tables']['package_items']['Row']

interface PriceSummaryProps {
  items: PackageItem[]
  currency: string
}

export function PriceSummary({ items, currency }: PriceSummaryProps) {
  const total = items.reduce((sum, item) => sum + (item.price || 0), 0)

  const byType = items.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = 0
    }
    acc[item.type] += item.price || 0
    return acc
  }, {} as Record<string, number>)

  return (
    <Card>
      <CardHeader>
        <CardTitle>סיכום מחירים</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {Object.entries(byType).map(([type, amount]) => (
            <div key={type} className="flex justify-between text-sm">
              <span className="text-gray-600">{type}</span>
              <span className="font-medium">
                {new Intl.NumberFormat('he-IL', {
                  style: 'currency',
                  currency: currency || 'USD',
                }).format(amount)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 flex justify-between font-bold text-lg">
          <span>סה"כ</span>
          <span>
            {new Intl.NumberFormat('he-IL', {
              style: 'currency',
              currency: currency || 'USD',
            }).format(total)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
