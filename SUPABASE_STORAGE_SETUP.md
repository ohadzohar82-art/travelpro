# הגדרת Supabase Storage להעלאת תמונות

## 🚀 דרך מהירה - הכל בסקריפט אחד!

**הרץ את הקובץ:** `SUPABASE_STORAGE_COMPLETE_SETUP.sql` ב-SQL Editor

הסקריפט הזה:
- ✅ יוצר את כל ה-buckets אוטומטית
- ✅ מגדיר את כל ה-RLS policies
- ✅ מאפשר גישה ציבורית לתמונות

---

## 📋 דרך ידנית (אם הסקריפט לא עובד)

### שלב 1: צור Buckets

1. היכנס ל-Supabase Dashboard: https://app.supabase.com
2. בחר את הפרויקט שלך
3. לחץ על **"Storage"** בתפריט השמאלי
4. לחץ על **"Create bucket"**

צור 3 buckets:

### 1. `destination-images`
- **Name:** `destination-images`
- **Public:** ✅ כן (Public bucket)
- **File size limit:** 5MB
- **Allowed MIME types:** `image/*`

### 2. `package-images`
- **Name:** `package-images`
- **Public:** ✅ כן (Public bucket)
- **File size limit:** 5MB
- **Allowed MIME types:** `image/*`

### 3. `logos`
- **Name:** `logos`
- **Public:** ✅ כן (Public bucket)
- **File size limit:** 2MB
- **Allowed MIME types:** `image/*`

---

### שלב 2: הגדר RLS Policies

לאחר יצירת ה-buckets, הרץ את הסקריפט הבא ב-SQL Editor:

```sql
-- Policy להעלאת תמונות יעדים
CREATE POLICY "Users can upload destination images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'destination-images' AND
  auth.uid() IN (SELECT id FROM users)
);

CREATE POLICY "Users can view destination images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'destination-images' AND
  auth.uid() IN (SELECT id FROM users)
);

CREATE POLICY "Users can delete their destination images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'destination-images' AND
  auth.uid() IN (SELECT id FROM users)
);

-- Policy להעלאת תמונות חבילות
CREATE POLICY "Users can upload package images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'package-images' AND
  auth.uid() IN (SELECT id FROM users)
);

CREATE POLICY "Users can view package images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'package-images' AND
  auth.uid() IN (SELECT id FROM users)
);

CREATE POLICY "Users can delete their package images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'package-images' AND
  auth.uid() IN (SELECT id FROM users)
);

-- Policy להעלאת לוגואים
CREATE POLICY "Users can upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'logos' AND
  auth.uid() IN (SELECT id FROM users)
);

CREATE POLICY "Users can view logos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'logos' AND
  auth.uid() IN (SELECT id FROM users)
);

CREATE POLICY "Users can delete their logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'logos' AND
  auth.uid() IN (SELECT id FROM users)
);
```

---

## שלב 3: בדוק שהכל עובד

1. נסה להעלות תמונה במדינה חדשה
2. נסה להעלות תמונה ביעד חדש
3. נסה להעלות לוגו בהגדרות

אם יש שגיאות, בדוק:
- שה-buckets נוצרו ונכונים
- שה-RLS policies הוגדרו
- שהמשתמש מחובר

---

## פתרון בעיות

**אם אתה רואה שגיאה "new row violates row-level security policy":**
- ודא שרצת את הסקריפט SQL לעיל
- ודא שה-buckets הם public
- ודא שהמשתמש מחובר

**אם התמונות לא מוצגות:**
- בדוק שה-bucket הוא public
- בדוק את ה-URL של התמונה ב-Console
- ודא שהתמונה הועלתה בהצלחה ב-Storage
