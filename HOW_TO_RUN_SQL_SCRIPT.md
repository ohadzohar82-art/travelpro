# איך להריץ את סקריפט ה-SQL - הוראות מפורטות

## שלב 1: מצא את מזהה הסוכנות שלך

1. היכנס ל-Supabase Dashboard: https://app.supabase.com
2. בחר את הפרויקט שלך
3. לחץ על **"SQL Editor"** בתפריט השמאלי
4. לחץ על **"New query"** (שאילתה חדשה)
5. העתק והדבק את השאילתה הבאה:

```sql
SELECT id FROM agencies LIMIT 1;
```

6. לחץ על **"Run"** (או Cmd/Ctrl + Enter)
7. העתק את המזהה (UUID) שמופיע בתוצאות - זה ה-`agency_id` שלך

**דוגמה למזהה:** `a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11`

---

## שלב 2: פתח את קובץ ה-SQL

1. פתח את הקובץ: `scripts/populate-countries-destinations.sql`
2. לחץ על **Ctrl+F** (או Cmd+Fac) כדי לחפש
3. חפש: `YOUR_AGENCY_ID`
4. החלף את כל המופעים של `YOUR_AGENCY_ID` במזהה שהעתקת בשלב 1

**דוגמה:**
- לפני: `('YOUR_AGENCY_ID', 'ישראל', 'Israel', ...)`
- אחרי: `('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ישראל', 'Israel', ...)`

---

## שלב 3: הרץ את הסקריפט

1. חזור ל-Supabase SQL Editor
2. לחץ על **"New query"** שוב (או נקה את השאילתה הקודמת)
3. העתק את כל התוכן מהקובץ `scripts/populate-countries-destinations.sql` (אחרי שהחלפת את `YOUR_AGENCY_ID`)
4. הדבק ב-SQL Editor
5. לחץ על **"Run"** (או Cmd/Ctrl + Enter)
6. חכה כמה שניות - אתה אמור לראות הודעה "Success"

---

## שלב 4: בדוק שהנתונים נוצרו

1. ב-Supabase, לחץ על **"Table Editor"** בתפריט השמאלי
2. בחר את הטבלה **"countries"** - אתה אמור לראות מדינות
3. בחר את הטבלה **"destinations"** - אתה אמור לראות יעדים

---

## בעיות נפוצות

**אם אתה רואה שגיאה:**
- **"relation does not exist"** - אתה צריך להריץ קודם את `COMPLETE_DATABASE_SETUP.sql`
- **"duplicate key"** - הנתונים כבר קיימים, זה בסדר
- **"YOUR_AGENCY_ID" עדיין בקוד** - שכחת להחליף את המזהה

**אם אין לך agency_id:**
1. היכנס לאפליקציה והרשם/התחבר
2. זה יוצר סוכנות אוטומטית
3. חזור לשלב 1 כדי למצוא את המזהה

---

## דרך מהירה (אם יש לך מזהה)

אם אתה כבר יודע את מזהה הסוכנות שלך, אתה יכול להריץ את זה ישירות:

```sql
-- החלף את 'YOUR_AGENCY_ID' במזהה שלך
-- ואז הרץ את כל הסקריפט
```
