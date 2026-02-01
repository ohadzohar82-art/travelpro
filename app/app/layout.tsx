'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { ErrorBoundary } from '@/components/ui/error-boundary'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AppLayout>{children}</AppLayout>
    </ErrorBoundary>
  )
}
