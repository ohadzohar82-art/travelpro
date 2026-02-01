-- ============================================
-- הוראות: החלף את 'YOUR_AGENCY_ID' במזהה הסוכנות שלך
-- למציאת המזהה: SELECT id FROM agencies LIMIT 1;
-- ============================================

-- שלב 1: מצא את המזהה שלך והחלף אותו כאן
-- לדוגמה: אם המזהה שלך הוא 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
-- החלף את כל המופעים של 'YOUR_AGENCY_ID' במזהה הזה

-- שלב 2: העתק את כל הקוד למטה והדבק ב-Supabase SQL Editor
-- שלב 3: לחץ Run

-- ============================================
-- מדינות נפוצות
-- ============================================

INSERT INTO countries (agency_id, name, name_en, code, currency, currency_symbol, language, timezone, is_active)
VALUES
  ('YOUR_AGENCY_ID', 'ישראל', 'Israel', 'IL', 'ILS', '₪', 'he', 'Asia/Jerusalem', true),
  ('YOUR_AGENCY_ID', 'תאילנד', 'Thailand', 'TH', 'THB', '฿', 'th', 'Asia/Bangkok', true),
  ('YOUR_AGENCY_ID', 'יוון', 'Greece', 'GR', 'EUR', '€', 'el', 'Europe/Athens', true),
  ('YOUR_AGENCY_ID', 'איטליה', 'Italy', 'IT', 'EUR', '€', 'it', 'Europe/Rome', true),
  ('YOUR_AGENCY_ID', 'ספרד', 'Spain', 'ES', 'EUR', '€', 'es', 'Europe/Madrid', true),
  ('YOUR_AGENCY_ID', 'פורטוגל', 'Portugal', 'PT', 'EUR', '€', 'pt', 'Europe/Lisbon', true),
  ('YOUR_AGENCY_ID', 'טורקיה', 'Turkey', 'TR', 'TRY', '₺', 'tr', 'Europe/Istanbul', true),
  ('YOUR_AGENCY_ID', 'צרפת', 'France', 'FR', 'EUR', '€', 'fr', 'Europe/Paris', true),
  ('YOUR_AGENCY_ID', 'בריטניה', 'United Kingdom', 'GB', 'GBP', '£', 'en', 'Europe/London', true),
  ('YOUR_AGENCY_ID', 'ארצות הברית', 'United States', 'US', 'USD', '$', 'en', 'America/New_York', true),
  ('YOUR_AGENCY_ID', 'יפן', 'Japan', 'JP', 'JPY', '¥', 'ja', 'Asia/Tokyo', true),
  ('YOUR_AGENCY_ID', 'דובאי', 'United Arab Emirates', 'AE', 'AED', 'د.إ', 'ar', 'Asia/Dubai', true),
  ('YOUR_AGENCY_ID', 'מצרים', 'Egypt', 'EG', 'EGP', '£', 'ar', 'Africa/Cairo', true),
  ('YOUR_AGENCY_ID', 'מרוקו', 'Morocco', 'MA', 'MAD', 'د.م.', 'ar', 'Africa/Casablanca', true),
  ('YOUR_AGENCY_ID', 'הודו', 'India', 'IN', 'INR', '₹', 'hi', 'Asia/Kolkata', true),
  ('YOUR_AGENCY_ID', 'סין', 'China', 'CN', 'CNY', '¥', 'zh', 'Asia/Shanghai', true),
  ('YOUR_AGENCY_ID', 'אוסטרליה', 'Australia', 'AU', 'AUD', 'A$', 'en', 'Australia/Sydney', true),
  ('YOUR_AGENCY_ID', 'ניו זילנד', 'New Zealand', 'NZ', 'NZD', 'NZ$', 'en', 'Pacific/Auckland', true),
  ('YOUR_AGENCY_ID', 'דרום אפריקה', 'South Africa', 'ZA', 'ZAR', 'R', 'en', 'Africa/Johannesburg', true),
  ('YOUR_AGENCY_ID', 'ברזיל', 'Brazil', 'BR', 'BRL', 'R$', 'pt', 'America/Sao_Paulo', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- יעדים נפוצים
-- ============================================

-- יעדים בתאילנד
INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  'YOUR_AGENCY_ID',
  id,
  'בנגקוק',
  'Bangkok',
  'Central',
  'BKK',
  true
FROM countries 
WHERE code = 'TH' AND agency_id = 'YOUR_AGENCY_ID' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  'YOUR_AGENCY_ID',
  id,
  'פוקט',
  'Phuket',
  'South',
  'HKT',
  true
FROM countries 
WHERE code = 'TH' AND agency_id = 'YOUR_AGENCY_ID' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  'YOUR_AGENCY_ID',
  id,
  'ציאנג מאי',
  'Chiang Mai',
  'North',
  'CNX',
  true
FROM countries 
WHERE code = 'TH' AND agency_id = 'YOUR_AGENCY_ID' 
LIMIT 1
ON CONFLICT DO NOTHING;

-- יעדים ביוון
INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  'YOUR_AGENCY_ID',
  id,
  'אתונה',
  'Athens',
  'Attica',
  'ATH',
  true
FROM countries 
WHERE code = 'GR' AND agency_id = 'YOUR_AGENCY_ID' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  'YOUR_AGENCY_ID',
  id,
  'סנטוריני',
  'Santorini',
  'South Aegean',
  'JTR',
  true
FROM countries 
WHERE code = 'GR' AND agency_id = 'YOUR_AGENCY_ID' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  'YOUR_AGENCY_ID',
  id,
  'מיקונוס',
  'Mykonos',
  'South Aegean',
  'JMK',
  true
FROM countries 
WHERE code = 'GR' AND agency_id = 'YOUR_AGENCY_ID' 
LIMIT 1
ON CONFLICT DO NOTHING;

-- יעדים באיטליה
INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  'YOUR_AGENCY_ID',
  id,
  'רומא',
  'Rome',
  'Lazio',
  'FCO',
  true
FROM countries 
WHERE code = 'IT' AND agency_id = 'YOUR_AGENCY_ID' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  'YOUR_AGENCY_ID',
  id,
  'ונציה',
  'Venice',
  'Veneto',
  'VCE',
  true
FROM countries 
WHERE code = 'IT' AND agency_id = 'YOUR_AGENCY_ID' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  'YOUR_AGENCY_ID',
  id,
  'מילאנו',
  'Milan',
  'Lombardy',
  'MXP',
  true
FROM countries 
WHERE code = 'IT' AND agency_id = 'YOUR_AGENCY_ID' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  'YOUR_AGENCY_ID',
  id,
  'פירנצה',
  'Florence',
  'Tuscany',
  'FLR',
  true
FROM countries 
WHERE code = 'IT' AND agency_id = 'YOUR_AGENCY_ID' 
LIMIT 1
ON CONFLICT DO NOTHING;

-- יעדים בספרד
INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  'YOUR_AGENCY_ID',
  id,
  'מדריד',
  'Madrid',
  'Madrid',
  'MAD',
  true
FROM countries 
WHERE code = 'ES' AND agency_id = 'YOUR_AGENCY_ID' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  'YOUR_AGENCY_ID',
  id,
  'ברצלונה',
  'Barcelona',
  'Catalonia',
  'BCN',
  true
FROM countries 
WHERE code = 'ES' AND agency_id = 'YOUR_AGENCY_ID' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  'YOUR_AGENCY_ID',
  id,
  'סביליה',
  'Seville',
  'Andalusia',
  'SVQ',
  true
FROM countries 
WHERE code = 'ES' AND agency_id = 'YOUR_AGENCY_ID' 
LIMIT 1
ON CONFLICT DO NOTHING;

-- יעדים בטורקיה
INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  'YOUR_AGENCY_ID',
  id,
  'איסטנבול',
  'Istanbul',
  'Istanbul',
  'IST',
  true
FROM countries 
WHERE code = 'TR' AND agency_id = 'YOUR_AGENCY_ID' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  'YOUR_AGENCY_ID',
  id,
  'קפדוקיה',
  'Cappadocia',
  'Central Anatolia',
  'NAV',
  true
FROM countries 
WHERE code = 'TR' AND agency_id = 'YOUR_AGENCY_ID' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  'YOUR_AGENCY_ID',
  id,
  'אנטליה',
  'Antalya',
  'Mediterranean',
  'AYT',
  true
FROM countries 
WHERE code = 'TR' AND agency_id = 'YOUR_AGENCY_ID' 
LIMIT 1
ON CONFLICT DO NOTHING;

-- יעדים בדובאי
INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  'YOUR_AGENCY_ID',
  id,
  'דובאי',
  'Dubai',
  'Dubai',
  'DXB',
  true
FROM countries 
WHERE code = 'AE' AND agency_id = 'YOUR_AGENCY_ID' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  'YOUR_AGENCY_ID',
  id,
  'אבו דאבי',
  'Abu Dhabi',
  'Abu Dhabi',
  'AUH',
  true
FROM countries 
WHERE code = 'AE' AND agency_id = 'YOUR_AGENCY_ID' 
LIMIT 1
ON CONFLICT DO NOTHING;

-- יעדים בישראל
INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  'YOUR_AGENCY_ID',
  id,
  'תל אביב',
  'Tel Aviv',
  'Center',
  'TLV',
  true
FROM countries 
WHERE code = 'IL' AND agency_id = 'YOUR_AGENCY_ID' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  'YOUR_AGENCY_ID',
  id,
  'ירושלים',
  'Jerusalem',
  'Jerusalem',
  'JRS',
  true
FROM countries 
WHERE code = 'IL' AND agency_id = 'YOUR_AGENCY_ID' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
SELECT 
  'YOUR_AGENCY_ID',
  id,
  'אילת',
  'Eilat',
  'South',
  'ETH',
  true
FROM countries 
WHERE code = 'IL' AND agency_id = 'YOUR_AGENCY_ID' 
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- סיום
-- ============================================
-- אחרי הרצת הסקריפט, בדוק שהנתונים נוצרו:
-- SELECT COUNT(*) FROM countries WHERE agency_id = 'YOUR_AGENCY_ID';
-- SELECT COUNT(*) FROM destinations WHERE agency_id = 'YOUR_AGENCY_ID';
