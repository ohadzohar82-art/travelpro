'use client'

import { useState, useRef } from 'react'
import { Button } from './button'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { uploadImage } from '@/lib/utils/image-upload'
import { toast } from 'sonner'
import Image from 'next/image'

interface ImageUploadProps {
  currentImage?: string | null
  onUpload: (url: string) => void
  onRemove?: () => void
  bucket: 'destination-images' | 'package-images' | 'logos'
  path: string
  label?: string
}

export function ImageUpload({
  currentImage,
  onUpload,
  onRemove,
  bucket,
  path,
  label = 'תמונה',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('אנא בחר קובץ תמונה')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('גודל הקובץ גדול מדי (מקסימום 5MB)')
      return
    }

    setUploading(true)
    try {
      // Show preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to Supabase
      const url = await uploadImage(file, bucket, path)
      onUpload(url)
      toast.success('תמונה הועלתה בהצלחה!')
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'שגיאה בהעלאת תמונה')
      setPreview(currentImage || null)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (onRemove) {
      onRemove()
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
            <button
              onClick={handleRemove}
              className="absolute top-1 left-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="ml-2 h-4 w-4" />
            {uploading ? 'מעלה...' : 'העלה תמונה'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    </div>
  )
}
