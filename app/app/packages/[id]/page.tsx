'use client'

import { PackageEditor } from '@/components/packages/package-editor'
import { use, Suspense, useMemo } from 'react'
import { ErrorBoundary } from '@/components/ui/error-boundary'

function PackageEditorWrapper({ params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = use(params)
    const id = resolvedParams?.id
    
    if (!id || typeof id !== 'string') {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">מזהה חבילה לא תקין</div>
        </div>
      )
    }
    
    return <PackageEditor packageId={id} />
  } catch (error: any) {
    console.error('Error resolving params:', error)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">שגיאה בטעינת החבילה</div>
      </div>
    )
  }
}

export default function PackageEditPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">טוען...</div>
        </div>
      }>
        <PackageEditorWrapper params={params} />
      </Suspense>
    </ErrorBoundary>
  )
}
