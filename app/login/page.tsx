'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser, setAgency } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      // Fetch user and agency data
      const { data: userDataArray, error: userError } = await supabase
        .from('users')
        .select('*, agencies(*)')
        .eq('id', authData.user.id)

      if (userError) throw userError
      
      if (!userDataArray || userDataArray.length === 0) {
        throw new Error('User record not found. Please sign up first.')
      }

      const userData = userDataArray[0]
      setUser(userData)
      // Handle agencies - it might be an array or object
      const agency = Array.isArray(userData.agencies) 
        ? userData.agencies[0] 
        : userData.agencies
      setAgency(agency)

      toast.success('התחברת בהצלחה!')
      
      // Use window.location for a hard redirect to ensure cookies are set
      window.location.href = '/app'
    } catch (error: any) {
      toast.error(error.message || 'שגיאה בהתחברות')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">התחברות</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                אימייל
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'מתחבר...' : 'התחבר'}
            </Button>
            <div className="text-center text-sm">
              <Link href="/forgot-password" className="text-primary hover:underline">
                שכחת סיסמה?
              </Link>
            </div>
            <div className="text-center text-sm">
              אין לך חשבון?{' '}
              <Link href="/signup" className="text-primary hover:underline">
                הירשם כאן
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
