import { createClient } from '@/lib/supabase/client'

export async function uploadImage(
  file: File,
  bucket: 'destination-images' | 'package-images' | 'logos',
  path: string
): Promise<string> {
  const supabase = createClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${path}-${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    throw uploadError
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return data.publicUrl
}

export async function deleteImage(
  bucket: 'destination-images' | 'package-images' | 'logos',
  path: string
): Promise<void> {
  const supabase = createClient()
  
  // Extract filename from URL
  const fileName = path.split('/').pop() || ''
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([fileName])

  if (error) {
    throw error
  }
}
