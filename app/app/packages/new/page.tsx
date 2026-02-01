'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'

export default function NewPackagePage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error('אנא הזן שם לחבילה')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('packages')
        .insert({
          agency_id: user?.agency_id,
          title,
          status: 'draft',
          currency: 'USD',
          adults: 2,
          children: 0,
          infants: 0,
          language: 'he',
        })
        .select()
        .single()

      if (error) throw error

      toast.success('חבילה נוצרה בהצלחה!')
      router.push(`/app/packages/${data.id}`)
    } catch (error: any) {
      toast.error(error.message || 'שגיאה ביצירת חבילה')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">חבילה חדשה</h1>
        <p className="text-gray-500 mt-2">צור חבילת נסיעות חדשה</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>פרטי חבילה</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              שם החבילה *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="לדוגמה: חבילת תאילנד מושלמת - 10 ימים"
              required
            />
          </div>
          <div className="flex gap-4">
            <Button onClick={handleCreate} disabled={loading}>
              {loading ? 'יוצר...' : 'צור חבילה'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              disabled={loading}
            >
              ביטול
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
