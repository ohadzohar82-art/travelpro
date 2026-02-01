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
  const { user, agency } = useAuthStore()
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
      
      // Get user and agency from session if not in store
      let currentUser = user
      let currentAgency = agency
      if (!currentUser || !currentAgency) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: userDataArray } = await supabase
            .from('users')
            .select('*, agencies(*)')
            .eq('id', session.user.id)
          if (userDataArray && userDataArray.length > 0) {
            currentUser = userDataArray[0]
            if (currentUser && currentUser.agencies) {
              currentAgency = Array.isArray(currentUser.agencies) 
                ? currentUser.agencies[0] 
                : currentUser.agencies
            }
          }
        }
      }
      
      if (!currentUser?.agency_id) {
        throw new Error('לא נמצא agency_id. אנא התחבר מחדש.')
      }
      
      const defaultCurrency = currentAgency?.default_currency || 'ILS'
      
      const { data, error } = await supabase
        .from('packages')
        .insert({
          agency_id: currentUser.agency_id,
          title,
          status: 'draft',
          currency: defaultCurrency,
          adults: 2,
          children: 0,
          infants: 0,
          language: 'he',
        })
        .select()

      if (error) {
        console.error('Package creation error:', error)
        if (error.message?.includes('schema cache') || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          toast.error('טבלת החבילות לא קיימת. אנא צור את הטבלאות ב-Supabase. ראה QUICK_SUPABASE_SETUP.md')
          setLoading(false)
          return
        }
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
