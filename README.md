# בונה מערכי שיעור – הוראות הפעלה

## שלב 1 – העלאה ל-GitHub

1. כנס ל-https://github.com וצור חשבון חינמי (אם אין לך)
2. לחץ על "New repository"
3. תן שם: `lesson-plan-agent`
4. לחץ "Create repository"
5. העלה את כל הקבצים של הפרויקט הזה

## שלב 2 – פריסה ב-Vercel (חינמי)

1. כנס ל-https://vercel.com וצור חשבון עם GitHub
2. לחץ "Add New Project"
3. בחר את ה-repository שיצרת
4. לחץ "Deploy" – Vercel יבנה הכל אוטומטית

## שלב 3 – הוספת מפתח API

1. ב-Vercel, כנס ל-Settings > Environment Variables
2. הוסף משתנה חדש:
   - שם: `ANTHROPIC_API_KEY`
   - ערך: המפתח שלך מ-https://console.anthropic.com
3. לחץ Save ואז Redeploy

## שלב 4 – קבל לינק ושתף

Vercel ייתן לך לינק כמו: `https://lesson-plan-agent.vercel.app`
שלח את הלינק לכל מורה – לא צריך להתקין כלום.

## עלות

- Vercel: חינם לשימוש בסיסי
- Anthropic API: ~$0.003 לכל מערך שיעור (כמה אגורות)
