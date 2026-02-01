'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DebugPage() {
  const [authStatus, setAuthStatus] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const check = async () => {
      const supabase = createClient()
      
      // Check auth
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      setAuthStatus({ user, authError })
      
      // Check session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      console.log('Session:', session, sessionError)
      
      // Try to fetch user data
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('*, agencies(*)')
          .eq('id', user.id)
        setUserData({ data, error })
      }
    }
    
    check()
  }, [])

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Debug Auth Status</h1>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Auth Status:</h2>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(authStatus, null, 2)}
        </pre>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold mb-2">User Data:</h2>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(userData, null, 2)}
        </pre>
      </div>
      
      <div className="space-x-2">
        <a href="/app" className="text-blue-500 underline">Go to Dashboard</a>
        <a href="/login" className="text-blue-500 underline">Go to Login</a>
      </div>
    </div>
  )
}
