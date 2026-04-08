"use client";
import { useState, useRef, useEffect } from "react";

const CURRICULUM = `
## תוכניות לימודים רשמיות — משרד החינוך הישראלי (חטיבת ביניים ממלכתי)
### היסטוריה — כיתה ז'
נושאי חובה: עליית הנצרות (ישוע מנצרת, הפצת הנצרות באימפריה הרומית, הנצרות כדת רשמית);
עליית האסלאם (הנביא מוחמד, חמשת עמודי האסלאם, ההִגְ'רָה, התפשטות האסלאם כחובה דתית);
המשותף לאסלאם, יהדות ונצרות; מעמד היהודים בחסות האסלאם; יהדות בבל עד תקופת הגאונים.
מיומנויות: התמצאות בציר הזמן, השוואה לפי תבחינים, ניתוח מקורות ראשוניים ומשניים, חשיבה ביקורתית.
### היסטוריה — כיתה ח'
נושאי חובה: הנאורות ורעיונותיה; המהפכה הצרפתית; הלאומיות באירופה; תהליכי דמוקרטיזציה ופרלמנטריזם;
השאלה היהודית בגולה ופתרונותיה (השכלה, ציונות, בונד, הגירה).
מיומנויות: ניסוח טענה והצדקתה, ניתוח טקסטים חזותיים, שיח לימודי בדילמות.
### היסטוריה — כיתה ט'
נושאי חובה: תנועת הציונות ועלייתה; הצהרת בלפור; השואה; קום המדינה.
### עברית (לשון) — כיתות ז'-ט'
תחומי חובה: הבנת הנקרא (טקסטים מורכבים, ספרותיים ועיוניים); הבעה כתובה (חיבור טיעוני, תיאורי, אישי);
לשון — תחביר, מורפולוגיה, שימוש נכון בדקדוק; אוצר מילים ופיתוח שפה.
מיומנויות: ניתוח טקסט, זיהוי אמצעים ספרותיים, כתיבה יצירתית ועיונית.
### ספרות — כיתות ז'-ט'
תחומי חובה: שירה (אלתרמן, רחל, לאה גולדברג, ביאליק, טשרניחובסקי ועוד); פרוזה (סיפורת עברית ועולמית);
דרמה; ז'אנרים: מיתוס, אגדה, סיפור קצר, רומן.
מיומנויות: ניתוח יצירה — נושא, מסר, דמויות, עלילה, אמצעים ספרותיים.
נושאים מרכזיים: זהות יהודית-ישראלית, דמות האדם, חברה ופרט, טבע ועיר.
### תנ"ך — כיתות ז'-ט'
תחומי חובה: ספרי שמואל, מלכים, ישעיהו, תהילים, משלי; ספרי תורה בהעמקה.
מיומנויות: פרשנות פסוקים, היכרות עם פרשנים קלאסיים (רש"י, רמב"ן), השוואת מקורות.
### אזרחות — כיתות ז'-ט'
תחומי חובה: מהי מדינה; מהי דמוקרטיה; הכנסת, הממשלה, מערכת המשפט;
זכויות וחובות האזרח; המיעוטים בישראל; ישראל כמדינה יהודית ודמוקרטית.
### גאוגרפיה — כיתות ז'-ט'
תחומי חובה: אדם וסביבה; אקלים ומשאבי טבע; אוכלוסייה ועיור; ישראל ואזוריה; תהליכי גלובליזציה.
### הנחיות כלליות לפי תוכנית משרד החינוך
- פתיחת כל נושא בציר זמן להבנת הרצף הכרונולוגי
- שימוש במקורות ראשוניים ומשניים
- טיפוח מיומנויות חשיבה: השוואה, ניתוח, טיעון, הסקת מסקנות
- שילוב ידע בין-תחומי
- התייחסות לזהות היהודית-ישראלית ולחברה הרב-תרבותית
`;

const MENTOR_PROMPT = `כל תגובותיך בעברית. כתוב תמיד מימין לשמאל. אל תערבב עברית ואנגלית באותו משפט.
אתה לא מחולל תוכן. אתה מאמן פדגוגי אישי.
מטרתך: ללוות מורים בתהליך חשיבה פדגוגי עמוק שמפתח את יכולתם לבנות הוראה דיפרנציאלית איכותית באופן עצמאי.
חוק הזהב: לא לעשות במקום המורה — ללמד את המורה לעשות בעצמו.
התמחות: מקצועות רבי-מלל — תנ"ך, ספרות, היסטוריה, אזרחות, לשון, גאוגרפיה — כיתות ז' עד י"ב.
עיקרון מנחה: הדיפרנציאציה אינה "חזקים וחלשים". היא מענה מדויק לסוגי שונות — מוכנות, ידע קודם, ויסות עצמי, העדפות למידה, ורקע רגשי.
כל תוכן שתיצור חייב להתבסס על תוכניות הלימודים הבאות של משרד החינוך בלבד:
${CURRICULUM}
## אבחון הכיתה — 5 שכבות (שאל לפי הסדר, שאלה אחת בכל פעם)
שכבה 1: כמה תלמידים? מה המקצוע? כמה שיעורים שבועיים? יש אבחנות?
שכבה 2: מה בדיוק שונה בין התלמידים — פער בקריאה/הבנה / ידע קודם / עצמאות / סגנון / רגשי-מוטיבציוני?
שכבה 3: מה כבר עובד?
שכבה 4: מה לא עובד?
שכבה 5: מה תרגיש נוח לנסות?
## זיהוי רמת מורה (לזהות, לא לשאול)
רמה 1: "אני נותן לכולם אותו דבר" — הסבר 80%, בנייה 20%
רמה 2: "אני מבין אבל לא יודע לבחור אסטרטגיה" — 50/50
רמה 3: "בניתי דף — רוצה שתעיף מבט?" — 70% המורה, 30% אתה
רמה 4: "חשבתי לשלב שתי אסטרטגיות" — 90% דיאלוג שווה
## חוקי ברזל
1. תהליך מלא: מבוא 5 דק' + 3 מסלולים 30 דק' + כרטיס יציאה 5 דק' + דיון 10 דק'
2. 3 מסלולים שונים ממשית לפי רמות החשיבה: א' זכירה-הבנה, ב' הבנה-יישום-ניתוח, ג' ניתוח-הערכה-יצירה
3. שפה מכבדת: "תלמיד הזקוק לתמיכה" לא "חלש"
4. אפס אימוג'ים. אפס ביטויי AI
5. דקדוק עברי תקני
6. שאלה אחת בכל פעם
## שאלות סוקרטיות מרכזיות
"מה התובנה שכל התלמידים צריכים לצאת איתה?"
"מה בדיוק לא מבינים? קריאה? אוצר מילים? ביטחון?"
"מי מרוויח ומי מפסיד כשכולם מקבלים אותו דבר?"
"מה הדבר הכי קטן שתוכל לשנות?"
"איך תדע בסוף השיעור מי הגיע להבנה?"
"מה מעניין את התלמידים שלך? אפשר לחבר את החומר לעולמות שלהם?"
"איך נראית הכיתה פיזית? אפשר ליצור פינות עבודה שונות?"
"האם החלוקה לקבוצות גמישה? אילו סימנים יגידו לך שתלמיד צריך לעבור רמה?"
## עקרונות בידול שלמות — המאמן מכיר 4 ממדים
1. נכונות (Readiness) — איפה התלמיד ביחס לחומר הספציפי, לא "חזק/חלש" כללי
2. עניין (Interest) — חיבור החומר לעולמות שמעניינים את התלמיד
3. פרופיל למידה — העדפות סביבתיות ואופן עיבוד המידע
4. קבוצות גמישות — החלוקה משתנה לפי נושא, לא קבועה לכל השנה
## טון: חם, מעודד, מקצועי, סבלני. "בוא נחשוב ביחד" — כן. "אני אגיד לך" — לא.`;

const TASKS_PROMPT = `כל תגובותיך בעברית. כתוב תמיד מימין לשמאל.
אתה כלי לבניית מטלות דיפרנציאליות למקצועות רבי-מלל במערכת החינוך הישראלית.
תפקידך: לשאול 4 שאלות בסיס, ולייצר מטלה מוכנה לשימוש מיידי.
אתה לא מנטור ולא מנהל דיון — אתה בונה תוצר.
כל תוכן שתיצור חייב להתבסס אך ורק על תוכניות הלימודים הרשמיות של משרד החינוך המפורטות לעיל.
אם הנושא אינו מופיע בתוכנית — ציין זאת למורה וציין באיזו כיתה הוא נלמד לפי התוכנית.
## פרוטוקול עבודה — 5 שאלות
בתחילת כל שיחה שאל את השאלות הבאות יחד, בהודעה אחת:
1. מה הנושא, המקצוע והכיתה?
2. כמה רמות דיפרנציאציה — 1, 2, או 3?
3. קובץ Word להדפסה, או טקסט בצ'אט?
4. מה המצב עם חומר הלימוד? בחר אחת מהאפשרויות:
   א. יש ספר לימוד / דף קריאה — התלמידים קוראים ממנו. בנה מטלה בלי טקסט (הניח שהטקסט קיים).
   ב. אין טקסט — צור טקסט לימודי קצר ומובנה בתוך המסמך (עד חצי עמוד לכל רמה, מותאם לרמה).
   ג. יש לי טקסט מקורי שאני רוצה לצרף — הדבק אותו בהודעה הבאה ואבנה מטלה עליו.
5. (אופציונלי) מה מקור השונות בכיתה? לדוגמה: פער בקריאה, ידע קודם, עצמאות, מוטיבציה. ניתן לדלג — אם תענה, המטלה תהיה מדויקת יותר.
אחרי שהמורה ענה — פעל כך:
- אם בחר א' — בנה מטלה מיד ללא טקסט.
- אם בחר ב' — בנה מטלה עם טקסט לימודי מובנה בפנים.
- אם בחר ג' — בקש ממנו להדביק את הטקסט בהודעה הבאה, ואחרי שידביק — בנה מטלה עליו.
אם המורה דילג על שאלה 5 — בנה מטלה דיפרנציאלית סטנדרטית.
אם המורה ענה על שאלה 5 — התאם את הרמות לסוג השונות שציין.
## בניית המטלה
כל מטלה כוללת: כותרת, הוראות לתלמיד, גוף המטלה לפי הרמות, כרטיס יציאה.
שלוש רמות:
רמה א — תמיכה מלאה: טקסט מפושט, פיגומים, שאלות סגורות-פתוחות. רמות חשיבה: זכירה-הבנה.
רמה ב — ליבה: טקסט מלא, שאלות פתוחות. רמות חשיבה: הבנה-יישום-ניתוח.
רמה ג — העמקה: טקסט מלא + מקור נוסף, שאלות מורכבות. רמות חשיבה: ניתוח-הערכה-יצירה.
שתי רמות:
רמה א — תמיכה: טקסט מפושט, פיגומים.
רמה ב — עצמאות: טקסט מלא, שאלות פתוחות.
היקף ברירת מחדל: 3-5 שאלות לרמה, 20-30 דקות.
## חוקי ברזל
- דקדוק עברי תקני מושלם
- אפס ביטויי AI ("צללו לעומק", "מסע מרתק" — אסור)
- אפס אימוג'ים בתוך המטלה
- "תלמיד הזקוק לתמיכה" לא "תלמיד חלש"
- כרטיס יציאה חובה תמיד
- הרמות שונות ממשית בסוג החשיבה, לא רק באורך
- במסלולים ב' ו-ג': טקסט מקורי ללא שינוי
- במסלול א': גרסה מפושטת עם ציון "גרסה מפושטת"
## עקרונות איכות — חובה בכל מטלה
טקסט: כל רמה מקבלת טקסט שונה — רמה א' טקסט מפושט ומקוצר, לא אותו טקסט לכולם.
שאלות: שאלה אחת = מושג אחד. אסור לשאול שתי שאלות נפרדות בתוך שאלה אחת. בכל שאלות רמה א' — רמז עקבי בסוגריים. רמה ב' דורשת עמדה ביקורתית או השוואה, לא רק תיאור.
כרטיס יציאה מובדל: רמה א' — בחירה בין 3 אפשרויות + הסבר קצר. רמה ב' — טענה היסטורית + ראיה מהטקסט.
בידול לפי עניין (אופציונלי): אם המורה ציין תחומי עניין של התלמידים (ספורט, מוזיקה, טכנולוגיה וכד') — שלב דוגמאות ממוסגרות בעולמות אלה בתוך השאלות או הטקסט. אם לא ציין — אל תשאל.
## חוקי ברזל נוספים — דיפרנציאציה בלתי נראית
הפרדת הערות המורה: הערות המורה חייבות להופיע במסמך נפרד לחלוטין — לעולם לא באותו דף עם המטלה לתלמיד. אם המורה ביקש Word — צור שני קבצים נפרדים: "מטלה לתלמיד" ו"הנחיות למורה". אם טקסט בצ'אט — הפרד בבירור עם כותרת "=== למורה בלבד — אין להראות לתלמידים ===".
אין היררכיה גלויה: אסור שתלמיד יוכל לזהות שיש רמות. אסור לכתוב "מתקדמת", "קשה", "חזקה", "רמה א/ב/ג" על דף התלמיד. כל שאלה מסומנת במספר רגיל בלבד.
אסור לכתוב בסוגריים או בכל מקום אחר על דף התלמיד: "(= תמיכה)", "(= ליבה)", "(= העמקה)", "בלש = תמיכה", "אנליסט = ליבה", "יועץ = העמקה" או כל ציון אחר שמגלה לתלמיד את רמתו. אם יש שמות תפקידים (בלש, אנליסט, יועץ וכד') — הם עומדים לבדם ללא שום פרשנות לצידם.
רמת "יועץ" / "חוקר" / העמקה — חייבת להיות קשה באמת: שאלות כמו "תאר רגשות" או "תן עצות" הן קלות — תלמידים חלשים יבחרו בהן ויהרסו את הדיפרנציאציה. שאלות ברמת ההעמקה חייבות לדרוש חשיבה מופשטת וביקורתית. לדוגמה: "כיצד רגשות הדמות משקפים תופעה אנושית כללית?" במקום "תאר רגשות". "האם הפתרון שמציע הסיפור ריאלי? נמק וצרף דוגמה מהחיים" במקום "איזה עצות היית נותן".
הנחיית בחירה לתלמיד: כשיש בחירת תפקיד/מסלול — הוסף משפט: "קרא את כל האפשרויות ובחר את זו שמרגישה לך הכי מעניינת ומאתגרת עבורך."
אפס אימוג'ים — בשום מקום, לא בדף התלמיד ולא בהערות המורה.
הערות למורה (במסמך נפרד): חובה לכלול —
- כיצד לחלק לרמות וקריטריוני הערכה לכל רמה
- מה לעשות עם כרטיסי היציאה
- קבוצות גמישות: החלוקה אינה קבועה — יש לעדכן לפי ביצועים. סימנים לשינוי רמה: תלמיד מסיים מהר מדי (הרמה קלה מדי) או לא מתחיל לכתוב (הרמה קשה מדי).
- סביבת עבודה: המלצה על סידור הכיתה — פינת שקט לתלמידים הזקוקים לתמיכה, עבודה בזוגות לרמת הליבה, עבודה עצמאית לרמת ההעמקה.`;

const GRADES    = ["ז'","ח'","ט'","י'","י\"א","י\"ב"];
const SUBJECTS  = ["עברית","תנ\"ך","היסטוריה","ספרות","אזרחות","גאוגרפיה","אנגלית","מדעים","אחר"];
const DURATIONS = ["45 דקות","90 דקות","שיעור כפול (2x45)"];
const LEVELS    = ["כיתה הומוגנית","רמות מעורבות","כיתה מתקדמת","כיתה מחוזקת"];

const IND="#4F46E5", IND_D="#3730A3", IND_L="#EEF2FF",
      BG="#F7F8FC", WH="#FFFFFF",
      G100="#F0F1F8", G200="#E2E5F0", G500="#6B7280", G700="#374151", G900="#1A1A2E",
      RED="#DC2626", RED_BG="#FEF2F2";

async function callAPI(payload) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "שגיאת שרת");
  return data.text;
}

const MODES = [
  { id: "mentor",  label: "מאמן פדגוגי" },
  { id: "tasks",   label: "בונה מטלות" },
  { id: "builder", label: "בניית מערך שיעור" },
  { id: "journal", label: "יומן מורה" },
];

export default function App() {
  const [mode, setMode] = useState("mentor");
  return (
    <div style={{ direction:"rtl", fontFamily:"'Segoe UI','Arial Hebrew',Arial,sans-serif", minHeight:"100vh", display:"flex", flexDirection:"column", background:BG }}>
      <nav style={{ background:WH, borderBottom:`1px solid ${G200}`, padding:"8px 16px", display:"flex", flexDirection:"column", alignItems:"center", gap:8, flexShrink:0 }}>
        <div style={{ fontSize:12, fontWeight:600, color:G900, textAlign:"center" }}>בוט מחקר "השפעת AI על למידה דיפרנציאלית"</div>
        <div style={{ display:"flex", gap:3, background:G100, borderRadius:9, padding:3, width:"100%", justifyContent:"center" }}>
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              style={{ flex:1, padding:"7px 8px", borderRadius:6, border:"none", cursor:"pointer", fontSize:12, fontFamily:"inherit",
                fontWeight: mode===m.id ? 600 : 400,
                background: mode===m.id ? WH : "transparent",
                color: mode===m.id ? IND : G500,
                boxShadow: mode===m.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                transition:"all 0.15s", whiteSpace:"nowrap" }}>
              {m.label}
            </button>
          ))}
        </div>
      </nav>

      {mode==="mentor"  && <ChatMode key="mentor"  systemPrompt={MENTOR_PROMPT} senderLabel="מאמן פדגוגי"
        greeting={"שלום! אני המאמן הפדגוגי שלך.\n\nאני כאן ללוות אותך בבניית הוראה דיפרנציאלית — לא לעשות במקומך, אלא לעזור לך לפתח את החשיבה הפדגוגית שלך.\n\nספר לי על הכיתה שאתה רוצה לעבוד עליה — כמה תלמידים, איזה מקצוע, ומה מרגיש לך הכי מאתגר?"}
        chips={["אבחון כיתה ומורה","שאלות סוקרטיות","3 מסלולים דיפרנציאליים","מעקב התקדמות"]}
        startLabel="התחל שיחה עם המאמן"/>}

      {mode==="tasks"   && <ChatMode key="tasks"   systemPrompt={TASKS_PROMPT}  senderLabel="בונה מטלות"
        greeting={"שלום! כדי לבנות את המטלה, אשאל כמה שאלות קצרות:\n\n1. מה הנושא, המקצוע והכיתה?\n2. כמה רמות דיפרנציאציה — 1, 2, או 3?\n3. קובץ Word להדפסה, או טקסט בצ'אט?\n4. מה המצב עם חומר הלימוד?\n   א. יש ספר / דף קריאה — בנה מטלה בלי טקסט\n   ב. אין טקסט — צור טקסט לימודי בתוך המסמך\n   ג. יש לי טקסט — אדביק אותו בהודעה הבאה\n5. (אופציונלי) מה מקור השונות בכיתה?"}
        chips={["4 שאלות בלבד","מטלה מוכנה מיד","כרטיס יציאה","עברית תקנית"]}
        startLabel="התחל בניית מטלה"/>}

      {mode==="builder" && <BuilderMode/>}
      {mode==="journal" && <JournalMode/>}

      {/* FIX 5: Print CSS — מסתיר ניווט ופקדים בעת הדפסה */}
      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
        @media print {
          nav { display: none !important; }
          button { display: none !important; }
          textarea { display: none !important; }
          div[data-input-bar] { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}

function ChatMode({ systemPrompt, greeting, chips, startLabel, senderLabel }) {
  // FIX 7: שמירת שיחה ב-localStorage לפי שם הכלי
  const storageKey = `chat_${senderLabel}`;

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [input, setInput]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [wordLoading, setWordLoading] = useState(false);
  const [lastTaskText, setLastTaskText] = useState(null);
  const [copiedIdx, setCopiedIdx]   = useState(null); // FIX 4: מעקב העתקה
  const bottomRef = useRef(null);

  // FIX 7: started נגזר מה-localStorage
  const [started, setStarted] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved && JSON.parse(saved).length > 0;
    } catch { return false; }
  });

  // FIX 7: שמירה אוטומטית בכל שינוי + גלילה
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(messages)); } catch {}
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const isTaskComplete = (text) =>
    text && text.length > 800 && (
      text.includes("רמה א") || text.includes("רמה ב") ||
      text.includes("כרטיס יציאה") || text.includes("הוראות לתלמיד")
    );

  // FIX 3: הורדת Word ללא קריאת AI מיותרת — שולח rawText ישירות
  const downloadWord = async () => {
    if (!lastTaskText || wordLoading) return;
    setWordLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: lastTaskText, generateWord: true }),
      });
      if (!res.ok) throw new Error("שגיאה");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "מטלה.docx"; a.click();
      URL.revokeObjectURL(url);
    } catch (e) { alert("שגיאה: " + e.message); }
    finally { setWordLoading(false); }
  };

  // FIX 4: העתקת הודעה ללוח
  const copyMessage = (text, idx) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const send = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated); setInput(""); setLoading(true);
    try {
      const cleanMessages = updated.filter(m => !m.error).map(m => ({ role: m.role, content: m.content }));
      const reply = await callAPI({ messages: cleanMessages, system: systemPrompt });
      setMessages([...updated, { role: "assistant", content: reply }]);
      if (isTaskComplete(reply)) setLastTaskText(reply);
    } catch (e) {
      const isOverload = e.message.includes("overloaded") || e.message.includes("529");
      const errMsg = isOverload ? "השרת עמוס כרגע — המתן כמה שניות ונסה שוב." : "משהו השתבש. נסה שוב.";
      setMessages([...updated, { role: "assistant", content: errMsg, error: true, retryText: text }]);
    } finally { setLoading(false); }
  };

  const start = () => {
    const greeting_msg = { role: "assistant", content: greeting };
    setStarted(true);
    setMessages([greeting_msg]);
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } };
  const textareaRows = input.length > 0 ? Math.min(8, Math.max(2, Math.ceil(input.length / 60))) : 2;

  if (!started) return (
    <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}>
      <div style={{ background:WH, borderRadius:18, border:`1px solid ${G200}`,
        padding:"clamp(24px, 5vw, 52px) clamp(20px, 5vw, 48px)", maxWidth:680, width:"100%", textAlign:"center" }}>
        <img src="/Untitled design.png" alt="לוגו" style={{ height:90, width:"auto", objectFit:"contain", marginBottom:20 }}/>

        {/* FIX 1: Chips — מציג תכונות הכלי לפני הפעלה */}
        {chips && chips.length > 0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:20 }}>
            {chips.map(chip => (
              <div key={chip} style={{ padding:"5px 13px", borderRadius:20, background:IND_L, color:IND,
                fontSize:12, fontWeight:500, border:`1px solid ${IND}` }}>
                {chip}
              </div>
            ))}
          </div>
        )}

        <button onClick={start}
          style={{ padding:"11px 32px", borderRadius:9, border:"none", background:IND,
            color:WH, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
          {startLabel}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div style={{ background:WH, borderBottom:`1px solid ${G200}`, padding:"8px 24px",
        display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div style={{ fontSize:12, fontWeight:600, color:G500 }}>{senderLabel}</div>
        {/* FIX 7: כפתור "התחל מחדש" גם מנקה localStorage */}
        <button onClick={() => {
            setStarted(false); setMessages([]); setInput(""); setLastTaskText(null);
            try { localStorage.removeItem(storageKey); } catch {}
          }}
          style={{ padding:"5px 14px", borderRadius:7, border:`1px solid ${G200}`,
            background:WH, color:G500, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
          התחל מחדש
        </button>
      </div>

      <div style={{ flex:1, overflowY:"auto" }}>
        <div style={{ maxWidth:760, margin:"0 auto", padding:"24px 18px", display:"flex", flexDirection:"column", gap:12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display:"flex", justifyContent: m.role==="user" ? "flex-start" : "flex-end" }}>
              <div style={{
                maxWidth: m.role==="assistant" ? "80%" : "65%",
                padding:"13px 17px",
                borderRadius: m.role==="user" ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
                background: m.role==="user" ? IND : m.error ? RED_BG : WH,
                border: m.role==="assistant" ? `1px solid ${G200}` : "none",
              }}>
                {m.role==="assistant" && (
                  <div style={{ fontSize:11, color:G500, marginBottom:5, fontWeight:600 }}>{senderLabel}</div>
                )}
                <div style={{ fontSize:14, lineHeight:1.8, whiteSpace:"pre-wrap", wordBreak:"break-word",
                  color: m.role==="user" ? WH : m.error ? RED : G900 }}>
                  {m.content}
                </div>

                {/* FIX 4: כפתור העתק לכל הודעת בוט */}
                {m.role==="assistant" && !m.error && (
                  <button onClick={() => copyMessage(m.content, i)}
                    style={{ marginTop:6, padding:"3px 10px", borderRadius:6, border:`1px solid ${G200}`,
                      background:"transparent", color: copiedIdx===i ? IND : G500,
                      fontSize:11, cursor:"pointer", fontFamily:"inherit", transition:"color 0.2s" }}>
                    {copiedIdx===i ? "הועתק ✓" : "העתק"}
                  </button>
                )}

                {m.error && m.retryText && (
                  <button onClick={() => send(m.retryText)}
                    style={{ marginTop:8, padding:"5px 14px", borderRadius:7, border:`1px solid ${RED}`,
                      background:WH, color:RED, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
                    נסה שוב
                  </button>
                )}

                {m.role==="assistant" && isTaskComplete(m.content) && (
                  <button onClick={downloadWord} disabled={wordLoading}
                    style={{ marginTop:12, padding:"8px 18px", borderRadius:8, border:"none",
                      background: wordLoading ? "#ccc" : IND, color:WH, fontSize:13, fontWeight:600,
                      cursor: wordLoading ? "default" : "pointer", fontFamily:"inherit",
                      display:"flex", alignItems:"center", gap:7 }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2v9M4 8l4 4 4-4M2 13h12" stroke={WH} strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                    {wordLoading ? "יוצר קובץ..." : "הורד קובץ Word"}
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display:"flex", justifyContent:"flex-end" }}>
              <div style={{ padding:"13px 17px", borderRadius:"16px 16px 4px 16px", background:WH, border:`1px solid ${G200}` }}>
                <div style={{ fontSize:11, color:G500, marginBottom:5, fontWeight:600 }}>{senderLabel}</div>
                <div style={{ display:"flex", gap:4 }}>
                  {[0, .2, .4].map((d, i) => (
                    <span key={i} style={{ width:7, height:7, borderRadius:"50%", background:G200,
                      display:"inline-block", animation:`bounce 1.2s ${d}s infinite` }}/>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>
      </div>

      {/* data-input-bar מאפשר הסתרה מדויקת ב-print */}
      <div data-input-bar style={{ background:WH, borderTop:`1px solid ${G200}`, padding:"12px 18px", flexShrink:0 }}>
        <div style={{ maxWidth:760, margin:"0 auto", display:"flex", gap:9, alignItems:"flex-end" }}>
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
            placeholder="כתבו כאן... (Enter לשליחה)" rows={textareaRows} disabled={loading}
            style={{ flex:1, resize:"none", padding:"10px 13px", borderRadius:9,
              border:`1px solid ${input.length>0 ? IND : G200}`, fontSize:14, fontFamily:"inherit",
              direction:"rtl", outline:"none", lineHeight:1.6, background:"#FAFBFC", color:G900, transition:"all 0.2s" }}/>
          <button onClick={() => send(input)} disabled={loading || !input.trim()}
            style={{ width:38, height:38, borderRadius:9, border:"none",
              background: loading || !input.trim() ? G200 : IND,
              cursor: loading || !input.trim() ? "default" : "pointer",
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"background 0.15s" }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M13 8H3M8.5 3.5L13 8l-4.5 4.5"
                stroke={loading || !input.trim() ? "#aaa" : WH} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

function BuilderMode() {
  const [form, setForm] = useState({
    subject:"", topic:"", grade:"", duration:"45 דקות", goals:"", levels:"כיתה הומוגנית",
    extras:{ differentiation:true, thinking:true, sel:false, diff_detail:false },
  });
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [step,    setStep]    = useState("form");

  const toggle = (key) => setForm(f => ({ ...f, extras:{ ...f.extras, [key]:!f.extras[key] } }));

  const buildPrompt = () => {
    const extras = [];
    if (form.extras.differentiation) extras.push("התאמות מפורטות לרמות שונות");
    if (form.extras.thinking)        extras.push("שאלות חשיבה מסדר גבוה");
    if (form.extras.sel)             extras.push("רכיבים חברתיים-רגשיים");
    if (form.extras.diff_detail)     extras.push("לכל שלב בשיעור (פתיחה, גוף, סיכום) — פרט הנחיות מובדלות: מה עושים תלמידים הזקוקים לתמיכה, מה עושים תלמידים עצמאיים, ומה עושים תלמידים מעמיקים");
    return `אתה מומחה לפדגוגיה, הוראה מובדלת ותכנון לימודים בישראל.
כל תוכן שתייצר חייב להתבסס על תוכניות הלימודים הרשמיות של משרד החינוך בלבד.
בנה מערך שיעור מקצועי בעברית:
מקצוע: ${form.subject} | נושא: ${form.topic} | כיתה: ${form.grade} | משך: ${form.duration}
מטרות: ${form.goals || "הגדר לפי הנושא"} | הרכב: ${form.levels}
${extras.length ? `דרישות: ${extras.join(", ")}` : ""}
החזר JSON בלבד:
{"title":"...","summary":"...","goals":["..."],"sections":[{"name":"פתיחה","duration":"X דקות","description":"...","activities":["..."]},{"name":"גוף השיעור","duration":"X דקות","description":"...","activities":["..."]},{"name":"סיכום","duration":"X דקות","description":"...","activities":["..."]}],"materials":["..."],"teacherNotes":"..."}`;
  };

  const generate = async () => {
    if (!form.subject || !form.topic || !form.grade) { setError("נא למלא מקצוע, נושא וכיתה"); return; }
    setError(null); setLoading(true); setResult(null);
    try {
      // FIX 2: פורמט תקין — messages במקום prompt
      const text = await callAPI({
        messages: [{ role: "user", content: buildPrompt() }],
        system: "",
      });
      const clean = text.replace(/```json|```/g, "").trim();
      const match = clean.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("לא התקבל JSON תקין");
      setResult(JSON.parse(match[0])); setStep("result");
    } catch (e) { setError(`שגיאה: ${e.message}`); }
    finally { setLoading(false); }
  };

  if (step==="result" && result) return (
    <div style={{ maxWidth:800, margin:"0 auto", padding:"24px 18px", flex:1 }}>
      <div style={{ background:IND, borderRadius:13, padding:"22px 26px", marginBottom:16, color:WH }}>
        <div style={{ fontSize:11, opacity:0.7, marginBottom:4 }}>{form.subject} | כיתה {form.grade} | {form.duration}</div>
        <h2 style={{ margin:"0 0 7px", fontSize:19, fontWeight:700 }}>{result.title}</h2>
        <p style={{ margin:0, opacity:0.85, fontSize:14, lineHeight:1.6 }}>{result.summary}</p>
      </div>
      {result.goals?.length > 0 && (
        <BCard title="מטרות השיעור">
          <ul style={{ margin:0, paddingRight:18, lineHeight:2 }}>
            {result.goals.map((g,i) => <li key={i} style={{ fontSize:14, color:G700 }}>{g}</li>)}
          </ul>
        </BCard>
      )}
      {result.sections?.map((sec, i) => (
        <BCard key={i} title={`${sec.name}${sec.duration ? ` — ${sec.duration}` : ""}`}
          accent={i===0 ? "#0EA5E9" : i===1 ? IND : "#6366F1"}>
          <p style={{ margin:"0 0 9px", fontSize:14, color:G700, lineHeight:1.7 }}>{sec.description}</p>
          {sec.activities?.map((a,j) => (
            <div key={j} style={{ padding:"8px 11px", marginBottom:6, background:IND_L, borderRadius:7,
              fontSize:13, color:G900, lineHeight:1.6, borderRight:`3px solid ${IND}` }}>{a}</div>
          ))}
        </BCard>
      ))}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
        {result.materials?.length > 0 && (
          <BCard title="חומרים" compact>
            <ul style={{ margin:0, paddingRight:16, lineHeight:2 }}>
              {result.materials.map((m,i) => <li key={i} style={{ fontSize:13, color:G700 }}>{m}</li>)}
            </ul>
          </BCard>
        )}
        {result.teacherNotes && (
          <BCard title="הערות למורה" compact>
            <p style={{ margin:0, fontSize:13, color:G700, lineHeight:1.7 }}>{result.teacherNotes}</p>
          </BCard>
        )}
      </div>
      <div style={{ display:"flex", gap:9 }}>
        <button onClick={() => { setStep("form"); setResult(null); }}
          style={{ flex:1, padding:"11px", borderRadius:9, border:`1px solid ${G200}`, background:WH,
            color:G700, fontSize:14, fontWeight:500, cursor:"pointer", fontFamily:"inherit" }}>
          בנה מערך חדש
        </button>
        <button onClick={() => window.print()}
          style={{ flex:1, padding:"11px", borderRadius:9, border:"none", background:IND,
            color:WH, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
          הדפס / שמור PDF
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:800, margin:"0 auto", padding:"24px 18px", flex:1 }}>
      <div style={{ background:WH, borderRadius:14, border:`1px solid ${G200}`, padding:"28px 32px" }}>
        <h2 style={{ margin:"0 0 22px", fontSize:16, fontWeight:600, color:G900 }}>פרטי השיעור</h2>

        {/* FIX 6: Grid רספונסיבי למובייל */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:12, marginBottom:16 }}>
          <BField label="מקצוע">
            <BSel value={form.subject} onChange={v => setForm(f => ({...f,subject:v}))} options={SUBJECTS} placeholder="בחר מקצוע"/>
          </BField>
          <BField label="כיתה">
            <BSel value={form.grade}   onChange={v => setForm(f => ({...f,grade:v}))}   options={GRADES}   placeholder="בחר כיתה"/>
          </BField>
          <BField label="משך">
            <BSel value={form.duration} onChange={v => setForm(f => ({...f,duration:v}))} options={DURATIONS}/>
          </BField>
        </div>

        <BField label="נושא השיעור">
          <input value={form.topic} onChange={e => setForm(f => ({...f,topic:e.target.value}))}
            placeholder="לדוגמה: המהפכה המדעית במאה ה-17" style={inp}/>
        </BField>
        <BField label="מטרות (אופציונלי)">
          <textarea value={form.goals} onChange={e => setForm(f => ({...f,goals:e.target.value}))}
            rows={3} style={{...inp, resize:"vertical", lineHeight:1.6}}/>
        </BField>
        <BField label="הרכב הכיתה">
          <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
            {LEVELS.map(l => (
              <button key={l} onClick={() => setForm(f => ({...f,levels:l}))}
                style={{ padding:"6px 13px", borderRadius:7,
                  border:`1.5px solid ${form.levels===l ? IND : G200}`,
                  background: form.levels===l ? IND_L : WH,
                  color: form.levels===l ? IND : G500,
                  cursor:"pointer", fontSize:13, fontFamily:"inherit",
                  fontWeight: form.levels===l ? 600 : 400 }}>
                {l}
              </button>
            ))}
          </div>
        </BField>

        <div style={{ background:"#FAFBFC", borderRadius:9, padding:"14px 18px", marginBottom:20, border:`1px solid ${G200}` }}>
          <div style={{ fontSize:12, fontWeight:600, color:G700, marginBottom:10 }}>רכיבים נוספים</div>
          <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
            {[
              { key:"differentiation", label:"התאמות לרמות שונות" },
              { key:"thinking",        label:"שאלות חשיבה מסדר גבוה" },
              { key:"sel",             label:"רכיבים חברתיים-רגשיים" },
              { key:"diff_detail",     label:"פירוט הוראה דיפרנציאלית לכל שלב" },
            ].map(({ key, label }) => (
              <label key={key} style={{ display:"flex", alignItems:"center", gap:7, cursor:"pointer" }}>
                <div onClick={() => toggle(key)}
                  style={{ width:17, height:17, borderRadius:4,
                    border:`2px solid ${form.extras[key] ? IND : G200}`,
                    background: form.extras[key] ? IND : WH,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {form.extras[key] && (
                    <svg width="9" height="9" viewBox="0 0 10 10">
                      <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
                <span style={{ fontSize:13, color:G700 }}>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ color:RED, fontSize:13, marginBottom:13, padding:"9px 13px", background:RED_BG, borderRadius:7 }}>
            {error}
          </div>
        )}
        <button onClick={generate} disabled={loading}
          style={{ width:"100%", padding:"13px", borderRadius:9, border:"none",
            background: loading ? G200 : IND, color: loading ? G500 : WH,
            fontSize:14, fontWeight:600, cursor: loading ? "default" : "pointer",
            fontFamily:"inherit", transition:"background 0.15s" }}>
          {loading ? "בונה מערך שיעור..." : "צור מערך שיעור"}
        </button>
      </div>
    </div>
  );
}

// EmailJS credentials
const EJS_SERVICE  = "service_j8uclds";
const EJS_TEMPLATE = "template_be2fy9j";
const EJS_KEY      = "0rPmh-xVzTSaExJ1X";

const JOURNAL_QUESTIONS = [
  { key: "q1", label: "מה ניסיתי השבוע עם הצ'אטבוט?",          placeholder: "תאר את הפעילות שביצעת..." },
  { key: "q2", label: "מה עבד טוב?",                             placeholder: "רגעים מוצלחים, תגובות מפתיעות של תלמידים..." },
  { key: "q3", label: "מה היה קשה או לא עבד?",                  placeholder: "קשיים שנתקלת בהם, מה לא הלך כמצופה..." },
  { key: "q4", label: "מה למדתי השבוע על הוראה דיפרנציאלית?",   placeholder: "תובנות חדשות, שינוי בתפיסה..." },
  { key: "q5", label: "מה אני רוצה לנסות בשבוע הבא?",           placeholder: "רעיונות לשיפור, ניסויים חדשים..." },
];

function JournalMode() {
  const STORAGE_KEY      = "teacher_journal";
  const TEACHER_NAME_KEY = "teacher_name";

  const loadEntries = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  };

  const [entries,     setEntries]     = useState(loadEntries);
  const [teacherName, setTeacherName] = useState(() => {
    try { return localStorage.getItem(TEACHER_NAME_KEY) || ""; } catch { return ""; }
  });
  const [current,  setCurrent]  = useState({ date: todayStr(), answers: {} });
  const [view,     setView]     = useState("write");
  const [sending,  setSending]  = useState(false);
  const [sendStatus, setSendStatus] = useState(null); // "ok" | "err"

  function todayStr() {
    return new Date().toLocaleDateString("he-IL", { day:"2-digit", month:"2-digit", year:"numeric" });
  }

  // שמירת שם המורה ב-localStorage
  const handleNameChange = (val) => {
    setTeacherName(val);
    try { localStorage.setItem(TEACHER_NAME_KEY, val); } catch {}
  };

  const setAnswer = (key, val) =>
    setCurrent(c => ({ ...c, answers: { ...c.answers, [key]: val } }));

  const buildText = (entry, name) => {
    const lines = [
      `יומן מורה שבועי`,
      `שם המורה: ${name || "לא צוין"}`,
      `תאריך: ${entry.date}`,
      "",
    ];
    JOURNAL_QUESTIONS.forEach(q => {
      const ans = (entry.answers[q.key] || "").trim();
      if (ans) { lines.push(q.label); lines.push(ans); lines.push(""); }
    });
    return lines.join("\n");
  };

  // טעינת EmailJS פעם אחת
  useEffect(() => {
    if (window.emailjs) return;
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    script.onload = () => window.emailjs.init({ publicKey: EJS_KEY });
    document.head.appendChild(script);
  }, []);

  const sendEmail = async (entry, name) => {
    if (sending) return;
    if (!name.trim()) { alert("נא להזין שם לפני השליחה"); return; }
    const hasContent = JOURNAL_QUESTIONS.some(q => (entry.answers[q.key] || "").trim());
    if (!hasContent) { alert("נא למלא לפחות תשובה אחת לפני השליחה"); return; }

    setSending(true);
    setSendStatus(null);
    try {
      await window.emailjs.send(EJS_SERVICE, EJS_TEMPLATE, {
        teacher_name: name,
        date:         entry.date,
        content:      buildText(entry, name),
      });
      setSendStatus("ok");
      // שמירה אוטומטית לאחר שליחה מוצלחת
      const updated = [{ ...entry, sentAt: new Date().toISOString() }, ...entries];
      setEntries(updated);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      setCurrent({ date: todayStr(), answers: {} });
      setTimeout(() => setSendStatus(null), 4000);
    } catch (e) {
      setSendStatus("err");
      setTimeout(() => setSendStatus(null), 4000);
    } finally {
      setSending(false);
    }
  };

  const deleteEntry = (idx) => {
    const updated = entries.filter((_, i) => i !== idx);
    setEntries(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
  };

  return (
    <div style={{ maxWidth:760, margin:"0 auto", padding:"24px 18px", flex:1 }}>

      {/* טאבים */}
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {[{ id:"write", label:"כתיבה שבועית" }, { id:"history", label:`היסטוריה (${entries.length})` }].map(t => (
          <button key={t.id} onClick={() => setView(t.id)}
            style={{ padding:"7px 18px", borderRadius:8, border:`1.5px solid ${view===t.id ? IND : G200}`,
              background: view===t.id ? IND_L : WH, color: view===t.id ? IND : G500,
              fontWeight: view===t.id ? 600 : 400, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* מסך כתיבה */}
      {view==="write" && (
        <div style={{ background:WH, borderRadius:14, border:`1px solid ${G200}`, padding:"28px 32px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
            <h2 style={{ margin:0, fontSize:16, fontWeight:600, color:G900 }}>יומן שבועי</h2>
            <div style={{ fontSize:12, color:G500, background:G100, padding:"4px 12px", borderRadius:20 }}>{current.date}</div>
          </div>

          {/* שם המורה */}
          <div style={{ marginBottom:24 }}>
            <label style={{ display:"block", fontSize:13, fontWeight:600, color:G700, marginBottom:7 }}>
              שם המורה
            </label>
            <input
              value={teacherName}
              onChange={e => handleNameChange(e.target.value)}
              placeholder="הכנס את שמך המלא"
              style={{ width:"100%", padding:"10px 13px", borderRadius:9,
                border:`1.5px solid ${teacherName ? IND : G200}`,
                fontSize:13, fontFamily:"inherit", direction:"rtl", outline:"none",
                background:"#FAFBFC", color:G900, boxSizing:"border-box" }}
            />
          </div>

          {/* שאלות */}
          {JOURNAL_QUESTIONS.map(q => (
            <div key={q.key} style={{ marginBottom:20 }}>
              <label style={{ display:"block", fontSize:13, fontWeight:600, color:G700, marginBottom:7 }}>
                {q.label}
              </label>
              <textarea
                value={current.answers[q.key] || ""}
                onChange={e => setAnswer(q.key, e.target.value)}
                placeholder={q.placeholder}
                rows={3}
                style={{ width:"100%", padding:"10px 13px", borderRadius:9, border:`1px solid ${G200}`,
                  fontSize:13, fontFamily:"inherit", direction:"rtl", outline:"none",
                  lineHeight:1.7, resize:"vertical", background:"#FAFBFC", color:G900,
                  boxSizing:"border-box" }}
              />
            </div>
          ))}

          {/* כפתור שליחה */}
          <button onClick={() => sendEmail(current, teacherName)} disabled={sending}
            style={{ width:"100%", padding:"13px", borderRadius:9, border:"none",
              background: sending ? G200 : IND, color: sending ? G500 : WH,
              fontSize:14, fontWeight:600, cursor: sending ? "default" : "pointer",
              fontFamily:"inherit", transition:"background 0.15s" }}>
            {sending ? "שולח..." : "שלח לחוקר"}
          </button>

          {/* הודעת סטטוס */}
          {sendStatus==="ok" && (
            <div style={{ marginTop:12, padding:"10px 16px", borderRadius:8,
              background:"#F0FDF4", border:"1px solid #86EFAC", color:"#166534",
              fontSize:13, textAlign:"center", fontWeight:500 }}>
              היומן נשלח בהצלחה לחוקר
            </div>
          )}
          {sendStatus==="err" && (
            <div style={{ marginTop:12, padding:"10px 16px", borderRadius:8,
              background:RED_BG, border:`1px solid ${RED}`, color:RED,
              fontSize:13, textAlign:"center", fontWeight:500 }}>
              שגיאה בשליחה — נסה שוב או בדוק חיבור לאינטרנט
            </div>
          )}
        </div>
      )}

      {/* היסטוריה */}
      {view==="history" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {entries.length === 0 && (
            <div style={{ textAlign:"center", color:G500, padding:"60px 0", fontSize:14 }}>
              עוד לא נשלחו רשומות
            </div>
          )}
          {entries.map((entry, idx) => (
            <div key={idx} style={{ background:WH, borderRadius:12, border:`1px solid ${G200}`,
              padding:"20px 24px", borderTop:`3px solid ${IND}` }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                <div>
                  <span style={{ fontSize:13, fontWeight:600, color:G900 }}>{entry.date}</span>
                  {entry.sentAt && (
                    <span style={{ fontSize:11, color:"#166534", background:"#F0FDF4",
                      padding:"2px 8px", borderRadius:10, marginRight:8 }}>נשלח ✓</span>
                  )}
                </div>
                <button onClick={() => deleteEntry(idx)}
                  style={{ padding:"5px 10px", borderRadius:7, border:`1px solid ${RED_BG}`,
                    background:RED_BG, color:RED, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
                  מחק
                </button>
              </div>
              {JOURNAL_QUESTIONS.map(q => {
                const ans = (entry.answers[q.key] || "").trim();
                if (!ans) return null;
                return (
                  <div key={q.key} style={{ marginBottom:12 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:IND, marginBottom:3 }}>{q.label}</div>
                    <div style={{ fontSize:13, color:G700, lineHeight:1.7, whiteSpace:"pre-wrap" }}>{ans}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BCard({ title, children, accent=IND, compact }) {
  return (
    <div style={{ background:WH, borderRadius:11, border:`1px solid ${G200}`,
      padding: compact ? "16px 20px" : "20px 24px", marginBottom: compact ? 0 : 12,
      borderTop:`3px solid ${accent}` }}>
      <h3 style={{ margin:"0 0 11px", fontSize:14, color:accent, fontWeight:600 }}>{title}</h3>
      {children}
    </div>
  );
}

function BField({ label, children }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:"block", fontSize:11, fontWeight:600, color:G500, marginBottom:6, letterSpacing:0.3 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inp = {
  width:"100%", padding:"8px 12px", borderRadius:7, border:`1px solid ${G200}`,
  fontSize:13, color:G900, background:WH, outline:"none",
  boxSizing:"border-box", fontFamily:"inherit", direction:"rtl",
};

function BSel({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={inp}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
