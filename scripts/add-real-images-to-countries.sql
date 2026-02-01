-- ============================================
-- הוספת תמונות אמיתיות למדינות
-- סקריפט זה מעדכן את ה-image_url של מדינות נפוצות עם תמונות מ-Unsplash
-- ============================================

-- מזהה הסוכנות: 4af931ea-e4f8-4728-9d82-30de9b2f2b14

-- ============================================
-- מדינות
-- ============================================

-- ישראל
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
WHERE name = 'ישראל' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- תאילנד
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
WHERE name = 'תאילנד' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- יוון
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1503789146722-cf137a3c0fea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
WHERE name = 'יוון' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- איטליה
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1529260830199-42c24126f198?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
WHERE name = 'איטליה' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- ספרד
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
WHERE name = 'ספרד' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- טורקיה
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
WHERE name = 'טורקיה' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- דובאי
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
WHERE name = 'דובאי' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- פורטוגל
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1529260830199-42c24126f198?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
WHERE name = 'פורטוגל' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- צרפת
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
WHERE name = 'צרפת' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- בריטניה
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
WHERE name = 'בריטניה' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- ארצות הברית
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
WHERE name = 'ארצות הברית' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- יפן
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
WHERE name = 'יפן' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- מצרים
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
WHERE name = 'מצרים' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- מרוקו
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
WHERE name = 'מרוקו' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- הודו
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
WHERE name = 'הודו' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- סין
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
WHERE name = 'סין' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- אוסטרליה
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
WHERE name = 'אוסטרליה' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- ניו זילנד
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
WHERE name = 'ניו זילנד' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- דרום אפריקה
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
WHERE name = 'דרום אפריקה' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- ברזיל
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
WHERE name = 'ברזיל' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- ============================================
-- סיום
-- ============================================
-- אחרי הרצת הסקריפט, בדוק שהתמונות עודכנו:
-- SELECT name, image_url FROM countries WHERE agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14' AND image_url IS NOT NULL;
