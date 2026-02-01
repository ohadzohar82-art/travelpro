'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    agency_name: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to create user')

      // Create agency
      const slug = formData.agency_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const { data: agencyDataArray, error: agencyError } = await supabase
        .from('agencies')
        .insert({
          name: formData.agency_name,
          slug,
        })
        .select()

      if (agencyError) throw agencyError
      if (!agencyDataArray || agencyDataArray.length === 0) {
        throw new Error('Failed to create agency')
      }
      
      const agencyData = agencyDataArray[0]

      // Create user record
      const { error: userError } = await supabase.from('users').insert({
        id: authData.user.id,
        agency_id: agencyData.id,
        full_name: formData.full_name,
        email: formData.email,
        role: 'owner',
      })

      if (userError) throw userError

      toast.success('נרשמת בהצלחה! אנא בדוק את האימייל שלך לאימות.')
      router.push('/login')
    } catch (error: any) {
      console.error('Signup error:', error)
      const errorMessage = error.message || 'שגיאה בהרשמה'
      
      // Check if it's a Supabase connection error
      if (errorMessage.includes('placeholder') || errorMessage.includes('fetch')) {
        toast.error('Supabase לא מוגדר. אנא הגדר את משתני הסביבה ב-Vercel.')
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">הרשמה</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="agency_name" className="block text-sm font-medium mb-2">
                שם הסוכנות
              </label>
              <Input
                id="agency_name"
                type="text"
                value={formData.agency_name}
                onChange={(e) => setFormData({ ...formData, agency_name: e.target.value })}
                required
                placeholder="שם הסוכנות"
              />
            </div>
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium mb-2">
                שם מלא
              </label>
              <Input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                placeholder="שם מלא"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                אימייל
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                סיסמה
              </label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'נרשם...' : 'הירשם'}
            </Button>
            <div className="text-center text-sm">
              יש לך כבר חשבון?{' '}
              <Link href="/login" className="text-primary hover:underline">
                התחבר כאן
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
