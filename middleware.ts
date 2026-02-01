// COMPLETELY DISABLED - This file does nothing
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // DO ABSOLUTELY NOTHING - Just pass through
  return NextResponse.next()
}

// Don't match anything - effectively disable middleware
export const config = {
  matcher: [],
}
