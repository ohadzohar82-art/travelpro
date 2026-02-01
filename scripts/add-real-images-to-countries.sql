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
SET image_url = 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&q=80'
WHERE name = 'ישראל' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- תאילנד
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80'
WHERE name = 'תאילנד' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- יוון
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1503789146722-cf137a3c0fea?w=800&q=80'
WHERE name = 'יוון' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- איטליה
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800&q=80'
WHERE name = 'איטליה' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- ספרד
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80'
WHERE name = 'ספרד' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- טורקיה
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80'
WHERE name = 'טורקיה' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- דובאי
UPDATE countries
SET image_url = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80'
WHERE name = 'דובאי' 
  AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14'
  AND (image_url IS NULL OR image_url = '');

-- ============================================
-- סיום
-- ============================================
-- אחרי הרצת הסקריפט, בדוק שהתמונות עודכנו:
-- SELECT name, image_url FROM countries WHERE agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14' AND image_url IS NOT NULL;
