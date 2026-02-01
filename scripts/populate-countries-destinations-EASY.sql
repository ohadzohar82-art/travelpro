-- ============================================
-- הוראות: החלף את '4af931ea-e4f8-4728-9d82-30de9b2f2b14' במזהה הסוכנות שלך
-- למציאת המזהה: SELECT id FROM agencies LIMIT 1;
-- ============================================

-- שלב 1: מצא את המזהה שלך והחלף אותו כאן
-- לדוגמה: אם המזהה שלך הוא 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
-- החלף את כל המופעים של '4af931ea-e4f8-4728-9d82-30de9b2f2b14' במזהה הזה

-- שלב 2: העתק את כל הקוד למטה והדבק ב-Supabase SQL Editor
-- שלב 3: לחץ Run

-- ============================================
-- מדינות נפוצות
-- ============================================

INSERT INTO countries (agency_id, name, name_en, code, currency, currency_symbol, language, timezone, is_active)
VALUES
  ('4af931ea-e4f8-4728-9d82-30de9b2f2b14', 'ישראל', 'Israel', 'IL', 'ILS', '₪', 'he', 'Asia/Jerusalem', true),
  ('4af931ea-e4f8-4728-9d82-30de9b2f2b14', 'תאילנד', 'Thailand', 'TH', 'THB', '฿', 'th', 'Asia/Bangkok', true),
  ('4af931ea-e4f8-4728-9d82-30de9b2f2b14', 'יוון', 'Greece', 'GR', 'EUR', '€', 'el', 'Europe/Athens', true),
  ('4af931ea-e4f8-4728-9d82-30de9b2f2b14', 'איטליה', 'Italy', 'IT', 'EUR', '€', 'it', 'Europe/Rome', true),
  ('4af931ea-e4f8-4728-9d82-30de9b2f2b14', 'ספרד', 'Spain', 'ES', 'EUR', '€', 'es', 'Europe/Madrid', true),
  ('4af931ea-e4f8-4728-9d82-30de9b2f2b14', 'פורטוגל', 'Portugal', 'PT', 'EUR', '€', 'pt', 'Europe/Lisbon', true),
  ('4af931ea-e4f8-4728-9d82-30de9b2f2b14', 'טורקיה', 'Turkey', 'TR', 'TRY', '₺', 'tr', 'Europe/Istanbul', true),
  ('4af931ea-e4f8-4728-9d82-30de9b2f2b14', 'צרפת', 'France', 'FR', 'EUR', '€', 'fr', 'Europe/Paris', true),
  ('4af931ea-e4f8-4728-9d82-30de9b2f2b14', 'בריטניה', 'United Kingdom', 'GB', 'GBP', '£', 'en', 'Europe/London', true),
  ('4af931ea-e4f8-4728-9d82-30de9b2f2b14', 'ארצות הברית', 'United States', 'US', 'USD', '$', 'en', 'America/New_York', true),
  ('4af931ea-e4f8-4728-9d82-30de9b2f2b14', 'יפן', 'Japan', 'JP', 'JPY', '¥', 'ja', 'Asia/Tokyo', true),
  ('4af931ea-e4f8-4728-9d82-30de9b2f2b14', 'דובאי', 'United Arab Emirates', 'AE', 'AED', 'د.إ', 'ar', 'Asia/Dubai', true),
  ('4af931ea-e4f8-4728-9d82-30de9b2f2b14', 'מצרים', 'Egypt', 'EG', 'EGP', '£', 'ar', 'Africa/Cairo', true),
  ('4af931ea-e4f8-4728-9d82-30de9b2f2b14', 'מרוקו', 'Morocco', 'MA', 'MAD', 'د.م.', 'ar', 'Africa/Casablanca', true),
  ('4af931ea-e4f8-4728-9d82-30de9b2f2b14', 'הודו', 'India', 'IN', 'INR', '₹', 'hi', 'Asia/Kolkata', true),
  ('4af931ea-e4f8-4728-9d82-30de9b2f2b14', 'סין', 'China', 'CN', 'CNY', '¥', 'zh', 'Asia/Shanghai', true),
  ('4af931ea-e4f8-4728-9d82-30de9b2f2b14', 'אוסטרליה', 'Australia', 'AU', 'AUD', 'A$', 'en', 'Australia/Sydney', true),
  ('4af931ea-e4f8-4728-9d82-30de9b2f2b14', 'ניו זילנד', 'New Zealand', 'NZ', 'NZD', 'NZ$', 'en', 'Pacific/Auckland', true),
  ('4af931ea-e4f8-4728-9d82-30de9b2f2b14', 'דרום אפריקה', 'South Africa', 'ZA', 'ZAR', 'R', 'en', 'Africa/Johannesburg', true),
  ('4af931ea-e4f8-4728-9d82-30de9b2f2b14', 'ברזיל', 'Brazil', 'BR', 'BRL', 'R$', 'pt', 'America/Sao_Paulo', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- יעדים נפוצים
-- ============================================

-- יעדים בתאילנד
INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  '4af931ea-e4f8-4728-9d82-30de9b2f2b14',
  id,
  'בנגקוק',
  'Bangkok',
  'Central',
  'BKK',
  true
FROM countries 
WHERE code = 'TH' AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  '4af931ea-e4f8-4728-9d82-30de9b2f2b14',
  id,
  'פוקט',
  'Phuket',
  'South',
  'HKT',
  true
FROM countries 
WHERE code = 'TH' AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  '4af931ea-e4f8-4728-9d82-30de9b2f2b14',
  id,
  'ציאנג מאי',
  'Chiang Mai',
  'North',
  'CNX',
  true
FROM countries 
WHERE code = 'TH' AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14' 
LIMIT 1
ON CONFLICT DO NOTHING;

-- יעדים ביוון
INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  '4af931ea-e4f8-4728-9d82-30de9b2f2b14',
  id,
  'אתונה',
  'Athens',
  'Attica',
  'ATH',
  true
FROM countries 
WHERE code = 'GR' AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  '4af931ea-e4f8-4728-9d82-30de9b2f2b14',
  id,
  'סנטוריני',
  'Santorini',
  'South Aegean',
  'JTR',
  true
FROM countries 
WHERE code = 'GR' AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  '4af931ea-e4f8-4728-9d82-30de9b2f2b14',
  id,
  'מיקונוס',
  'Mykonos',
  'South Aegean',
  'JMK',
  true
FROM countries 
WHERE code = 'GR' AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14' 
LIMIT 1
ON CONFLICT DO NOTHING;

-- יעדים באיטליה
INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  '4af931ea-e4f8-4728-9d82-30de9b2f2b14',
  id,
  'רומא',
  'Rome',
  'Lazio',
  'FCO',
  true
FROM countries 
WHERE code = 'IT' AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  '4af931ea-e4f8-4728-9d82-30de9b2f2b14',
  id,
  'ונציה',
  'Venice',
  'Veneto',
  'VCE',
  true
FROM countries 
WHERE code = 'IT' AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  '4af931ea-e4f8-4728-9d82-30de9b2f2b14',
  id,
  'מילאנו',
  'Milan',
  'Lombardy',
  'MXP',
  true
FROM countries 
WHERE code = 'IT' AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  '4af931ea-e4f8-4728-9d82-30de9b2f2b14',
  id,
  'פירנצה',
  'Florence',
  'Tuscany',
  'FLR',
  true
FROM countries 
WHERE code = 'IT' AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14' 
LIMIT 1
ON CONFLICT DO NOTHING;

-- יעדים בספרד
INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  '4af931ea-e4f8-4728-9d82-30de9b2f2b14',
  id,
  'מדריד',
  'Madrid',
  'Madrid',
  'MAD',
  true
FROM countries 
WHERE code = 'ES' AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  '4af931ea-e4f8-4728-9d82-30de9b2f2b14',
  id,
  'ברצלונה',
  'Barcelona',
  'Catalonia',
  'BCN',
  true
FROM countries 
WHERE code = 'ES' AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  '4af931ea-e4f8-4728-9d82-30de9b2f2b14',
  id,
  'סביליה',
  'Seville',
  'Andalusia',
  'SVQ',
  true
FROM countries 
WHERE code = 'ES' AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14' 
LIMIT 1
ON CONFLICT DO NOTHING;

-- יעדים בטורקיה
INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  '4af931ea-e4f8-4728-9d82-30de9b2f2b14',
  id,
  'איסטנבול',
  'Istanbul',
  'Istanbul',
  'IST',
  true
FROM countries 
WHERE code = 'TR' AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  '4af931ea-e4f8-4728-9d82-30de9b2f2b14',
  id,
  'קפדוקיה',
  'Cappadocia',
  'Central Anatolia',
  'NAV',
  true
FROM countries 
WHERE code = 'TR' AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  '4af931ea-e4f8-4728-9d82-30de9b2f2b14',
  id,
  'אנטליה',
  'Antalya',
  'Mediterranean',
  'AYT',
  true
FROM countries 
WHERE code = 'TR' AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14' 
LIMIT 1
ON CONFLICT DO NOTHING;

-- יעדים בדובאי
INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  '4af931ea-e4f8-4728-9d82-30de9b2f2b14',
  id,
  'דובאי',
  'Dubai',
  'Dubai',
  'DXB',
  true
FROM countries 
WHERE code = 'AE' AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  '4af931ea-e4f8-4728-9d82-30de9b2f2b14',
  id,
  'אבו דאבי',
  'Abu Dhabi',
  'Abu Dhabi',
  'AUH',
  true
FROM countries 
WHERE code = 'AE' AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14' 
LIMIT 1
ON CONFLICT DO NOTHING;

-- יעדים בישראל
INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  '4af931ea-e4f8-4728-9d82-30de9b2f2b14',
  id,
  'תל אביב',
  'Tel Aviv',
  'Center',
  'TLV',
  true
FROM countries 
WHERE code = 'IL' AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  '4af931ea-e4f8-4728-9d82-30de9b2f2b14',
  id,
  'ירושלים',
  'Jerusalem',
  'Jerusalem',
  'JRS',
  true
FROM countries 
WHERE code = 'IL' AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  '4af931ea-e4f8-4728-9d82-30de9b2f2b14',
  id,
  'אילת',
  'Eilat',
  'South',
  'ETH',
  true
FROM countries 
WHERE code = 'IL' AND agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14' 
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- סיום
-- ============================================
-- אחרי הרצת הסקריפט, בדוק שהנתונים נוצרו:
-- SELECT COUNT(*) FROM countries WHERE agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14';
-- SELECT COUNT(*) FROM destinations WHERE agency_id = '4af931ea-e4f8-4728-9d82-30de9b2f2b14';
