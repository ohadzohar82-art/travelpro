'use client'

import { PackageEditor } from '@/components/packages/package-editor'
import { Suspense } from 'react'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { useParams } from 'next/navigation'
import { Loader } from '@/components/ui/loader'

function PackageEditorWrapper() {
  const params = useParams()
  const id = params?.id as string | undefined
  
  if (!id || typeof id !== 'string') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 mb-2">מזהה חבילה לא תקין</div>
          <div className="text-sm text-gray-500">המזהה שהועבר אינו תקין</div>
        </div>
      </div>
    )
  }
  
  return <PackageEditor packageId={id} />
}

export default function PackageEditPage({ params }: { params: Promise<{ id: string }> }) {
  // Use useParams hook instead of use() for better compatibility
  return (
    <ErrorBoundary>
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <Loader />
            </div>
          }>
        <PackageEditorWrapper />
      </Suspense>
    </ErrorBoundary>
  )
}
