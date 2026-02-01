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
      
      if (!currentUser?.agency_id) {
        throw new Error('לא נמצא agency_id. אנא התחבר מחדש.')
      }
      
      const { data, error } = await supabase
        .from('packages')
        .insert({
          agency_id: currentUser.agency_id,
          title,
          status: 'draft',
          currency: 'USD',
          adults: 2,
          children: 0,
          infants: 0,
          language: 'he',
        })
        .select()

      if (error) {
        console.error('Package creation error:', error)
        throw error
      }
      
      if (!data || data.length === 0) {
        throw new Error('Failed to create package - no data returned')
      }

      toast.success('חבילה נוצרה בהצלחה!')
      router.push(`/app/packages/${data[0].id}`)
    } catch (error: any) {
      console.error('Error creating package:', error)
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
