-- ============================================
-- Supabase Storage - Complete Setup Script
-- הרץ את הסקריפט הזה ב-SQL Editor
-- ============================================

-- ============================================
-- שלב 1: צור Buckets (אם הם לא קיימים)
-- ============================================

-- בדוק אם ה-buckets קיימים, ואם לא - צור אותם
-- הערה: זה דורש הרשאות admin. אם זה לא עובד, צור את ה-buckets ידנית דרך Dashboard

-- Bucket 1: destination-images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'destination-images',
  'destination-images',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket 2: package-images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'package-images',
  'package-images',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket 3: logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'logos',
  'logos',
  true,
  2097152, -- 2MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- שלב 2: מחק RLS Policies קיימות (אם יש)
-- ============================================

-- מחק policies קיימות כדי למנוע כפילויות
-- מחק את כל הפוליסי הקשורות ל-storage.objects
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON storage.objects';
    END LOOP;
END $$;

-- ============================================
-- שלב 3: צור RLS Policies חדשות
-- ============================================

-- Policies לתמונות יעדים (destination-images)
CREATE POLICY "Users can upload destination images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'destination-images' AND
  auth.uid() IN (SELECT id FROM public.users)
);

CREATE POLICY "Users can view destination images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'destination-images' AND
  auth.uid() IN (SELECT id FROM public.users)
);

-- Allow public read access for destination images
CREATE POLICY "Public can view destination images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'destination-images');

CREATE POLICY "Users can update their destination images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'destination-images' AND
  auth.uid() IN (SELECT id FROM public.users)
)
WITH CHECK (
  bucket_id = 'destination-images' AND
  auth.uid() IN (SELECT id FROM public.users)
);

CREATE POLICY "Users can delete their destination images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'destination-images' AND
  auth.uid() IN (SELECT id FROM public.users)
);

-- Policies לתמונות חבילות (package-images)
CREATE POLICY "Users can upload package images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'package-images' AND
  auth.uid() IN (SELECT id FROM public.users)
);

CREATE POLICY "Users can view package images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'package-images' AND
  auth.uid() IN (SELECT id FROM public.users)
);

-- Allow public read access for package images
CREATE POLICY "Public can view package images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'package-images');

CREATE POLICY "Users can update their package images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'package-images' AND
  auth.uid() IN (SELECT id FROM public.users)
)
WITH CHECK (
  bucket_id = 'package-images' AND
  auth.uid() IN (SELECT id FROM public.users)
);

CREATE POLICY "Users can delete their package images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'package-images' AND
  auth.uid() IN (SELECT id FROM public.users)
);

-- Policies ללוגואים (logos)
CREATE POLICY "Users can upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'logos' AND
  auth.uid() IN (SELECT id FROM public.users)
);

CREATE POLICY "Users can view logos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'logos' AND
  auth.uid() IN (SELECT id FROM public.users)
);

-- Allow public read access for logos
CREATE POLICY "Public can view logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'logos');

CREATE POLICY "Users can update their logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'logos' AND
  auth.uid() IN (SELECT id FROM public.users)
)
WITH CHECK (
  bucket_id = 'logos' AND
  auth.uid() IN (SELECT id FROM public.users)
);

CREATE POLICY "Users can delete their logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'logos' AND
  auth.uid() IN (SELECT id FROM public.users)
);

-- ============================================
-- שלב 4: בדוק שהכל עובד
-- ============================================

-- בדוק שה-buckets נוצרו
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id IN ('destination-images', 'package-images', 'logos');

-- בדוק שה-policies נוצרו
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%destination%' OR policyname LIKE '%package%' OR policyname LIKE '%logo%';

-- ============================================
-- סיום
-- ============================================
-- אם ה-buckets לא נוצרו אוטומטית, צור אותם ידנית:
-- 1. לך ל-Storage > Create bucket
-- 2. צור 3 buckets: destination-images, package-images, logos
-- 3. הגדר אותם כ-Public
-- 4. הרץ את הסקריפט הזה שוב כדי ליצור את ה-policies
