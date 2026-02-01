import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
    
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co' || !supabaseKey || supabaseKey === 'placeholder-key') {
      console.warn('Supabase environment variables are not set. Using placeholder values.')
    }
    
    return createBrowserClient(supabaseUrl, supabaseKey)
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    // Return a minimal client to prevent crashes
    return createBrowserClient('https://placeholder.supabase.co', 'placeholder-key')
  }
}
