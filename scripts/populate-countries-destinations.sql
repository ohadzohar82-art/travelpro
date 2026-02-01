-- ============================================
-- Populate Countries and Destinations
-- Run this in Supabase SQL Editor
-- ============================================

-- First, get your agency_id (replace with your actual agency_id)
-- You can find it by running: SELECT id FROM agencies LIMIT 1;

-- Common countries data
INSERT INTO countries (agency_id, name, name_en, code, currency, currency_symbol, language, timezone, is_active)
VALUES
  -- Replace 'YOUR_AGENCY_ID' with your actual agency_id
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

-- Common destinations (you'll need to get country_ids first)
-- First, get country IDs:
-- SELECT id, name FROM countries WHERE agency_id = 'YOUR_AGENCY_ID';

-- Then insert destinations (replace country_id values with actual IDs from above query)
INSERT INTO destinations (agency_id, country_id, name, name_en, region, airport_code, is_active)
VALUES
  -- Thailand destinations
  ('YOUR_AGENCY_ID', (SELECT id FROM countries WHERE code = 'TH' AND agency_id = 'YOUR_AGENCY_ID' LIMIT 1), 'בנגקוק', 'Bangkok', 'Central', 'BKK', true),
  ('YOUR_AGENCY_ID', (SELECT id FROM countries WHERE code = 'TH' AND agency_id = 'YOUR_AGENCY_ID' LIMIT 1), 'פוקט', 'Phuket', 'South', 'HKT', true),
  ('YOUR_AGENCY_ID', (SELECT id FROM countries WHERE code = 'TH' AND agency_id = 'YOUR_AGENCY_ID' LIMIT 1), 'ציאנג מאי', 'Chiang Mai', 'North', 'CNX', true),
  
  -- Greece destinations
  ('YOUR_AGENCY_ID', (SELECT id FROM countries WHERE code = 'GR' AND agency_id = 'YOUR_AGENCY_ID' LIMIT 1), 'אתונה', 'Athens', 'Attica', 'ATH', true),
  ('YOUR_AGENCY_ID', (SELECT id FROM countries WHERE code = 'GR' AND agency_id = 'YOUR_AGENCY_ID' LIMIT 1), 'סנטוריני', 'Santorini', 'South Aegean', 'JTR', true),
  ('YOUR_AGENCY_ID', (SELECT id FROM countries WHERE code = 'GR' AND agency_id = 'YOUR_AGENCY_ID' LIMIT 1), 'מיקונוס', 'Mykonos', 'South Aegean', 'JMK', true),
  
  -- Italy destinations
  ('YOUR_AGENCY_ID', (SELECT id FROM countries WHERE code = 'IT' AND agency_id = 'YOUR_AGENCY_ID' LIMIT 1), 'רומא', 'Rome', 'Lazio', 'FCO', true),
  ('YOUR_AGENCY_ID', (SELECT id FROM countries WHERE code = 'IT' AND agency_id = 'YOUR_AGENCY_ID' LIMIT 1), 'ונציה', 'Venice', 'Veneto', 'VCE', true),
  ('YOUR_AGENCY_ID', (SELECT id FROM countries WHERE code = 'IT' AND agency_id = 'YOUR_AGENCY_ID' LIMIT 1), 'מילאנו', 'Milan', 'Lombardy', 'MXP', true),
  ('YOUR_AGENCY_ID', (SELECT id FROM countries WHERE code = 'IT' AND agency_id = 'YOUR_AGENCY_ID' LIMIT 1), 'פירנצה', 'Florence', 'Tuscany', 'FLR', true),
  
  -- Spain destinations
  ('YOUR_AGENCY_ID', (SELECT id FROM countries WHERE code = 'ES' AND agency_id = 'YOUR_AGENCY_ID' LIMIT 1), 'מדריד', 'Madrid', 'Madrid', 'MAD', true),
  ('YOUR_AGENCY_ID', (SELECT id FROM countries WHERE code = 'ES' AND agency_id = 'YOUR_AGENCY_ID' LIMIT 1), 'ברצלונה', 'Barcelona', 'Catalonia', 'BCN', true),
  ('YOUR_AGENCY_ID', (SELECT id FROM countries WHERE code = 'ES' AND agency_id = 'YOUR_AGENCY_ID' LIMIT 1), 'סביליה', 'Seville', 'Andalusia', 'SVQ', true),
  
  -- Turkey destinations
  ('YOUR_AGENCY_ID', (SELECT id FROM countries WHERE code = 'TR' AND agency_id = 'YOUR_AGENCY_ID' LIMIT 1), 'איסטנבול', 'Istanbul', 'Istanbul', 'IST', true),
  ('YOUR_AGENCY_ID', (SELECT id FROM countries WHERE code = 'TR' AND agency_id = 'YOUR_AGENCY_ID' LIMIT 1), 'קפדוקיה', 'Cappadocia', 'Central Anatolia', 'NAV', true),
  ('YOUR_AGENCY_ID', (SELECT id FROM countries WHERE code = 'TR' AND agency_id = 'YOUR_AGENCY_ID' LIMIT 1), 'אנטליה', 'Antalya', 'Mediterranean', 'AYT', true),
  
  -- UAE destinations
  ('YOUR_AGENCY_ID', (SELECT id FROM countries WHERE code = 'AE' AND agency_id = 'YOUR_AGENCY_ID' LIMIT 1), 'דובאי', 'Dubai', 'Dubai', 'DXB', true),
  ('YOUR_AGENCY_ID', (SELECT id FROM countries WHERE code = 'AE' AND agency_id = 'YOUR_AGENCY_ID' LIMIT 1), 'אבו דאבי', 'Abu Dhabi', 'Abu Dhabi', 'AUH', true),
  
  -- Israel destinations
  ('YOUR_AGENCY_ID', (SELECT id FROM countries WHERE code = 'IL' AND agency_id = 'YOUR_AGENCY_ID' LIMIT 1), 'תל אביב', 'Tel Aviv', 'Center', 'TLV', true),
  ('YOUR_AGENCY_ID', (SELECT id FROM countries WHERE code = 'IL' AND agency_id = 'YOUR_AGENCY_ID' LIMIT 1), 'ירושלים', 'Jerusalem', 'Jerusalem', 'JRS', true),
  ('YOUR_AGENCY_ID', (SELECT id FROM countries WHERE code = 'IL' AND agency_id = 'YOUR_AGENCY_ID' LIMIT 1), 'אילת', 'Eilat', 'South', 'ETH', true)
ON CONFLICT DO NOTHING;

-- Note: After running this script, you can manually add images to countries and destinations
-- through the UI or by updating the image_url field directly in the database.
