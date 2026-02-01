'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import type { Database } from '@/types/database'

type Template = Database['public']['Tables']['templates']['Row']

export default function TemplatesPage() {
  const { user } = useAuthStore()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTemplates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadTemplates = async () => {
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
      
      let query = supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (currentUser?.agency_id) {
        query = query.eq('agency_id', currentUser.agency_id)
      }
      
      const { data, error } = await query

      if (error) throw error
      setTemplates(data || [])
    } catch (error) {
      console.error('Error loading templates:', error)
    } finally {
      setLoading(false)
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">תבניות</h1>
          <p className="text-gray-500 mt-2">נהל את התבניות שלך</p>
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          תבנית חדשה
        </Button>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">אין תבניות עדיין</p>
            <Button>צור תבנית ראשונה</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                {template.description && (
                  <p className="text-gray-600 mb-2">{template.description}</p>
                )}
                {template.duration_days && (
                  <p className="text-sm text-gray-500">
                    {template.duration_days} ימים
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  שימוש: {template.usage_count} פעמים
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
