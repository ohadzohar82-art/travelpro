'use client'

import { PackageEditor } from '@/components/packages/package-editor'
import { use } from 'react'

export default function PackageEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <PackageEditor packageId={id} />
}
