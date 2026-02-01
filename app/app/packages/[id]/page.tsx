'use client'

import { PackageEditor } from '@/components/packages/package-editor'
import { use, Suspense } from 'react'

function PackageEditorWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  if (!id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">טוען...</div>
      </div>
    )
  }
  
  return <PackageEditor packageId={id} />
}

export default function PackageEditPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">טוען...</div>
      </div>
    }>
      <PackageEditorWrapper params={params} />
    </Suspense>
  )
}
