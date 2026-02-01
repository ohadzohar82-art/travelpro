'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'
import type { Database } from '@/types/database'

type Agency = Database['public']['Tables']['agencies']['Row']

export default function SettingsPage() {
  const { agency, setAgency } = useAuthStore()
  const [formData, setFormData] = useState<Partial<Agency>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadAgency = async () => {
      try {
        // If agency is in store, use it
        if (agency) {
          setFormData(agency)
          setLoading(false)
          return
        }

        // Otherwise, load from session
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          const { data: userDataArray } = await supabase
            .from('users')
            .select('*, agencies(*)')
            .eq('id', session.user.id)
          
          if (userDataArray && userDataArray.length > 0) {
            const userData = userDataArray[0]
            const agencyData = Array.isArray(userData.agencies) 
              ? userData.agencies[0] 
              : userData.agencies
            
            if (agencyData) {
              setAgency(agencyData)
              setFormData(agencyData)
            }
          }
        }
      } catch (error) {
        console.error('Error loading agency:', error)
        toast.error('שגיאה בטעינת נתוני הסוכנות')
      } finally {
        setLoading(false)
      }
    }

    loadAgency()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agency])

  const handleSave = async () => {
    if (!agency) return

    setSaving(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('agencies')
        .update(formData)
        .eq('id', agency.id)
        .select()

      if (error) throw error
      if (!data || data.length === 0) {
        throw new Error('Failed to update settings')
      }
      setAgency(data[0])
      toast.success('הגדרות נשמרו בהצלחה!')
    } catch (error: any) {
      toast.error(error.message || 'שגיאה בשמירת הגדרות')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">טוען...</div>
      </div>
    )
  }

  if (!agency && !loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="p-6">
          <p className="text-gray-500">לא נמצאו נתוני סוכנות. אנא התחבר מחדש.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">הגדרות</h1>
          <p className="text-gray-500 mt-2">נהל את הגדרות הסוכנות שלך</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-xl">פרטי סוכנות</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  שם הסוכנות *
                </label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full"
                  placeholder="הזן שם סוכנות"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  אימייל ליצירת קשר
                </label>
                <Input
                  type="email"
                  value={formData.contact_email || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_email: e.target.value })
                  }
                  className="w-full"
                  placeholder="contact@agency.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  טלפון
                </label>
                <Input
                  value={formData.contact_phone || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_phone: e.target.value })
                  }
                  className="w-full"
                  placeholder="03-1234567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  WhatsApp
                </label>
                <Input
                  value={formData.contact_whatsapp || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_whatsapp: e.target.value })
                  }
                  className="w-full"
                  placeholder="050-1234567"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  כתובת
                </label>
                <Input
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full"
                  placeholder="רחוב, עיר, מדינה"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  מטבע ברירת מחדל
                </label>
                <Input
                  value={formData.default_currency || 'USD'}
                  onChange={(e) =>
                    setFormData({ ...formData, default_currency: e.target.value })
                  }
                  className="w-full"
                  placeholder="USD"
                />
                <p className="text-xs text-gray-500 mt-1">קוד מטבע (USD, EUR, ILS וכו&apos;)</p>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t">
              <Button 
                onClick={handleSave} 
                disabled={saving || !formData.name}
                className="min-w-[120px]"
              >
                {saving ? 'שומר...' : 'שמור הגדרות'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-lg">מידע נוסף</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">תוכנית מנוי</p>
              <p className="text-base font-semibold capitalize">
                {agency?.subscription_plan || 'basic'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">סטטוס מנוי</p>
              <p className="text-base font-semibold capitalize">
                {agency?.subscription_status || 'active'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">תאריך יצירה</p>
              <p className="text-base font-semibold">
                {agency?.created_at 
                  ? new Date(agency.created_at).toLocaleDateString('he-IL')
                  : '-'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Images Management Section */}
      <Card className="md:col-span-2">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="text-xl">ניהול תמונות</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">העלאת תמונות</h3>
              <p className="text-sm text-gray-600 mb-4">
                העלה תמונות למדינות ויעדים דרך דפי הניהול שלהם. התמונות יישמרו ב-Supabase Storage.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>הוראות:</strong> כדי להוסיף תמונות למדינות או יעדים, עבור לדפי &quot;מדינות&quot; או &quot;יעדים&quot; 
                  ולחץ על &quot;מדינה חדשה&quot; או &quot;יעד חדש&quot;. תוכל להעלות תמונה ישירות בטופס.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">מילוי אוטומטי של מדינות ויעדים</h3>
              <p className="text-sm text-gray-600 mb-4">
                כדי למלא את מסד הנתונים במדינות ויעדים נפוצים, עקוב אחר ההוראות:
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-blue-900 mb-2">📋 הוראות מפורטות:</p>
                <p className="text-sm text-blue-800 mb-2">
                  פתח את הקובץ <code className="bg-blue-100 px-2 py-1 rounded">HOW_TO_RUN_SQL_SCRIPT.md</code> 
                  לקבלת הוראות מפורטות בעברית.
                </p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-gray-900 mb-1">שלב 1: מצא את מזהה הסוכנות</p>
                  <code className="block bg-white p-2 rounded text-xs mt-2">
                    SELECT id FROM agencies LIMIT 1;
                  </code>
                  <p className="text-xs text-gray-600 mt-2">הרץ את זה ב-Supabase SQL Editor והעתק את המזהה</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-gray-900 mb-1">שלב 2: פתח את קובץ ה-SQL</p>
                  <code className="block bg-white p-2 rounded text-xs mt-2">
                    scripts/populate-countries-destinations-EASY.sql
                  </code>
                  <p className="text-xs text-gray-600 mt-2">חפש והחלף את כל המופעים של <code>YOUR_AGENCY_ID</code> במזהה שלך</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-gray-900 mb-1">שלב 3: הרץ את הסקריפט</p>
                  <p className="text-xs text-gray-600">העתק את כל הקוד והדבק ב-Supabase SQL Editor, לחץ Run</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ חשוב:</strong> לפני הרצת הסקריפט, ודא שרצת קודם את <code>COMPLETE_DATABASE_SETUP.sql</code> 
                  כדי ליצור את הטבלאות.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
