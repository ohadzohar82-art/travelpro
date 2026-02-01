# Deploy ידני ב-Vercel

אם ה-deploy האוטומטי לא עובד, יש כמה דרכים לעשות deploy ידני:

## דרך 1: דרך Vercel Dashboard

1. היכנס ל-Vercel Dashboard: https://vercel.com/dashboard
2. בחר את הפרויקט `travelpro`
3. לחץ על **"Deployments"** בתפריט
4. לחץ על **"Redeploy"** או **"Deploy"**
5. בחר את ה-branch `main`
6. לחץ **"Deploy"**

## דרך 2: דרך Vercel CLI

אם יש לך Vercel CLI מותקן:

```bash
npm i -g vercel
vercel login
vercel --prod
```

## דרך 3: בדוק את ה-Integration

1. לך ל-Vercel Dashboard
2. בחר את הפרויקט
3. לך ל-**Settings** > **Git**
4. ודא שה-GitHub Integration פעיל
5. אם לא, לחץ **"Connect Git Repository"** וחבר מחדש

## דרך 4: בדוק את ה-Webhook

1. לך ל-GitHub Repository: https://github.com/ohadzohar82-art/travelpro
2. לך ל-**Settings** > **Webhooks**
3. ודא שיש webhook ל-Vercel
4. אם לא, Vercel צריך ליצור אותו אוטומטית כשאתה מחבר את ה-repo

## פתרון בעיות

**אם ה-deploy לא מתחיל:**
- בדוק שה-repository מחובר ב-Vercel
- בדוק שה-branch `main` מוגדר כ-production branch
- נסה לעשות commit חדש (כבר עשיתי commit ריק)

**אם ה-deploy נכשל:**
- בדוק את ה-logs ב-Vercel Dashboard
- בדוק שה-build command נכון: `npm run build`
- ודא שכל ה-environment variables מוגדרים

## בדיקת סטטוס

לאחר ה-deploy, בדוק:
1. ה-Deployments page ב-Vercel
2. ה-URL של ה-deployment
3. ה-build logs אם יש שגיאות
