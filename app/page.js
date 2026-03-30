"use client";
import { useState, useRef, useEffect } from "react";

// ─── System prompts ───────────────────────────────────────────────────────────

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
רמה 1: "אני נותן לכולם אותו דבר" → הסבר 80%, בנייה 20%
רמה 2: "אני מבין אבל לא יודע לבחור אסטרטגיה" → 50/50
רמה 3: "בניתי דף — רוצה שתעיף מבט?" → 70% המורה, 30% אתה
רמה 4: "חשבתי לשלב שתי אסטרטגיות" → 90% דיאלוג שווה

## חוקי ברזל
1. תהליך מלא: מבוא 5 דק' + 3 מסלולים 30 דק' + כרטיס יציאה 5 דק' + דיון 10 דק'
2. 3 מסלולים שונים ממשית לפי רמות החשיבה: א' זכירה–הבנה, ב' הבנה–יישום–ניתוח, ג' ניתוח–הערכה–יצירה
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

## טון: חם, מעודד, מקצועי, סבלני. "בוא נחשוב ביחד" — כן. "אני אגיד לך" — לא.`;

const TASKS_PROMPT = `כל תגובותיך בעברית. כתוב תמיד מימין לשמאל.

אתה כלי לבניית מטלות דיפרנציאליות למקצועות רבי-מלל במערכת החינוך הישראלית.
תפקידך: לשאול 3 שאלות בסיס, ולייצר מטלה מוכנה לשימוש מיידי.
אתה לא מנטור ולא מנהל דיון — אתה בונה תוצר.

כל תוכן שתיצור חייב להתבסס אך ורק על תוכניות הלימודים הרשמיות של משרד החינוך המפורטות לעיל.
אם הנושא אינו מופיע בתוכנית — ציין זאת למורה וציין באיזו כיתה הוא נלמד לפי התוכנית.

## פרוטוקול עבודה — 3 שאלות בלבד

בתחילת כל שיחה שאל את 3 השאלות הבאות יחד, בהודעה אחת:
1. מה הנושא, המקצוע והכיתה?
2. כמה רמות דיפרנציאציה — 1, 2, או 3?
3. קובץ Word להדפסה, או טקסט בצ'אט?

אחרי שהמורה ענה — צור את המטלה מיד. אל תשאל שאלות נוספות אלא אם חסר מידע קריטי.

## בניית המטלה

כל מטלה כוללת: כותרת, הוראות לתלמיד, גוף המטלה לפי הרמות, כרטיס יציאה.

שלוש רמות:
רמה א — תמיכה מלאה: טקסט מפושט, פיגומים, שאלות סגורות-פתוחות. רמות חשיבה: זכירה–הבנה.
רמה ב — ליבה: טקסט מלא, שאלות פתוחות. רמות חשיבה: הבנה–יישום–ניתוח.
רמה ג — העמקה: טקסט מלא + מקור נוסף, שאלות מורכבות. רמות חשיבה: ניתוח–הערכה–יצירה.

שתי רמות:
רמה א — תמיכה: טקסט מפושט, פיגומים.
רמה ב — עצמאות: טקסט מלא, שאלות פתוחות.

היקף ברירת מחדל: 3–5 שאלות לרמה, 20–30 דקות.

## חוקי ברזל
- דקדוק עברי תקני מושלם
- אפס ביטויי AI ("צללו לעומק", "מסע מרתק" — אסור)
- אפס אימוג'ים בתוך המטלה
- "תלמיד הזקוק לתמיכה" לא "תלמיד חלש"
- כרטיס יציאה חובה תמיד
- הרמות שונות ממשית בסוג החשיבה, לא רק באורך
- במסלולים ב' ו-ג': טקסט מקורי ללא שינוי
- במסלול א': גרסה מפושטת עם ציון "גרסה מפושטת"`;

// ─── Quick builder data ───────────────────────────────────────────────────────
const GRADES    = ["ז'", "ח'", "ט'", "י'", "י\"א", "י\"ב"];
const SUBJECTS  = ["עברית", "תנ\"ך", "היסטוריה", "ספרות", "אזרחות", "גאוגרפיה", "אנגלית", "מדעים", "אחר"];
const DURATIONS = ["45 דקות", "90 דקות", "שיעור כפול (2×45)"];
const LEVELS    = ["כיתה הומוגנית", "רמות מעורבות – נמוך/בינוני/גבוה", "כיתה מתקדמת", "כיתה מחוזקת"];

// ─── Shared API call ──────────────────────────────────────────────────────────
async function callAPI(payload) {
  const res  = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "שגיאת שרת");
  return data.text;
}

// ─── Mode labels ──────────────────────────────────────────────────────────────
const MODES = [
  { id: "mentor",  label: "מאמן פדגוגי",  desc: "ליווי מקצועי בבניית הוראה דיפרנציאלית" },
  { id: "tasks",   label: "בונה מטלות",   desc: "יצירת מטלות דיפרנציאליות מוכנות לשימוש" },
  { id: "builder", label: "בונה מהיר",    desc: "הזן פרמטרים וקבל מערך שיעור תוך שניות" },
];

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState("mentor");
  const current = MODES.find(m => m.id === mode);

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div style={S.headerInner}>
          <div style={S.headerSub}>כלי AI לצוות החינוכי</div>
          <h1 style={S.headerTitle}>{current.label}</h1>
          <div style={S.headerDesc}>{current.desc}</div>
          <div style={S.toggle}>
            {MODES.map(m => (
              <button key={m.id} onClick={() => setMode(m.id)}
                style={{ ...S.toggleBtn, ...(mode === m.id ? S.toggleActive : {}) }}>
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {mode === "mentor"  && <ChatMode key="mentor"  systemPrompt={MENTOR_PROMPT} greeting={"שלום! אני המנטור הפדגוגי שלך.\n\nאני כאן כדי ללוות אותך בבניית הוראה דיפרנציאלית — לא לעשות במקומך, אלא לעזור לך לפתח את החשיבה הפדגוגית שלך.\n\nבוא נתחיל מהשטח: ספר לי על הכיתה שאתה רוצה לעבוד עליה — כמה תלמידים, איזה מקצוע, ומה מרגיש לך כרגע הכי מאתגר?"} chips={["אבחון כיתה ומורה", "שאלות סוקרטיות", "3 מסלולים דיפרנציאליים", "מעקב התקדמות"]} startLabel="התחל שיחה עם המנטור" />}
      {mode === "tasks"   && <ChatMode key="tasks"   systemPrompt={TASKS_PROMPT}  greeting={"שלום! כדי לבנות את המטלה, אשאל שלוש שאלות קצרות:\n\n1. מה הנושא, המקצוע והכיתה?\n2. כמה רמות דיפרנציאציה — 1, 2, או 3?\n3. קובץ Word להדפסה, או טקסט בצ'אט?"} chips={["3 שאלות בלבד", "מטלה מוכנה מיד", "כרטיס יציאה אוטומטי", "עברית תקנית"]} startLabel="התחל בניית מטלה" />}
      {mode === "builder" && <BuilderMode />}

      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}

// ─── Chat mode (shared by mentor + tasks) ────────────────────────────────────
function ChatMode({ systemPrompt, greeting, chips, startLabel }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [started, setStarted]   = useState(false);
  const bottomRef               = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    try {
      const reply = await callAPI({ messages: updated, system: systemPrompt });
      setMessages([...updated, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages([...updated, { role: "assistant", content: `שגיאה: ${e.message}`, error: true }]);
    } finally { setLoading(false); }
  };

  const start = () => {
    setStarted(true);
    setMessages([{ role: "assistant", content: greeting }]);
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } };

  if (!started) return (
    <div style={S.centerFill}>
      <div style={S.welcomeBox}>
        <div style={S.chips}>{chips.map(c => <span key={c} style={S.chip}>{c}</span>)}</div>
        <button onClick={start} style={S.primaryBtn}>{startLabel}</button>
      </div>
    </div>
  );

  return (
    <>
      <div style={S.chatScroll}>
        <div style={S.chatInner}>
          {messages.map((m, i) => (
            <div key={i} style={{ ...S.row, justifyContent: m.role === "user" ? "flex-start" : "flex-end" }}>
              <div style={{
                ...S.bubble,
                background:   m.role === "user" ? "#e8eaf6" : m.error ? "#ffebee" : "white",
                borderRadius: m.role === "user" ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
                boxShadow:    m.role === "assistant" ? "0 2px 12px rgba(0,0,0,0.08)" : "none",
                maxWidth:     m.role === "assistant" ? "82%" : "65%",
              }}>
                {m.role === "assistant" && <div style={S.sender}>עוזר AI</div>}
                <div style={{ ...S.msgText, color: m.error ? "#c62828" : "#222" }}>{m.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ ...S.row, justifyContent: "flex-end" }}>
              <div style={{ ...S.bubble, background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                <div style={S.sender}>עוזר AI</div>
                <div style={{ display: "flex", gap: 5, padding: "4px 0" }}>
                  {[0, 0.2, 0.4].map((d, i) => <span key={i} style={{ ...S.dot, animationDelay: `${d}s` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
      <div style={S.inputBar}>
        <div style={S.inputInner}>
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
            placeholder="כתוב כאן... (Enter לשליחה, Shift+Enter לשורה חדשה)"
            rows={2} disabled={loading} style={S.textarea} />
          <button onClick={() => send(input)} disabled={loading || !input.trim()}
            style={{ ...S.primaryBtn, opacity: loading || !input.trim() ? 0.5 : 1, padding: "12px 24px", width: "auto" }}>
            שלח
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Builder mode ─────────────────────────────────────────────────────────────
function BuilderMode() {
  const [form, setForm] = useState({
    subject: "", topic: "", grade: "", duration: "45 דקות", goals: "",
    levels: "כיתה הומוגנית",
    extras: { differentiation: true, thinking: true, sel: false },
  });
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [step, setStep]       = useState("form");

  const toggle = (key) => setForm(f => ({ ...f, extras: { ...f.extras, [key]: !f.extras[key] } }));

  const buildPrompt = () => {
    const extras = [];
    if (form.extras.differentiation) extras.push("התאמות מפורטות לרמות שונות");
    if (form.extras.thinking)        extras.push("שאלות חשיבה מסדר גבוה (בלומס)");
    if (form.extras.sel)             extras.push("רכיבים חברתיים-רגשיים – מיומנויות חברתיות-רגשיות");
    return `אתה מומחה לפדגוגיה, הוראה מובדלת ותכנון לימודים בישראל.
כל תוכן שתייצר חייב להתבסס על תוכניות הלימודים הרשמיות של משרד החינוך בלבד. אם הנושא אינו מופיע בתוכנית — ציין זאת.
בנה מערך שיעור מקצועי ומפורט בעברית:
מקצוע: ${form.subject} | נושא: ${form.topic} | כיתה: ${form.grade} | משך: ${form.duration}
מטרות: ${form.goals || "הגדר לפי הנושא"} | הרכב: ${form.levels}
${extras.length ? `דרישות: ${extras.join(", ")}` : ""}

החזר JSON בלבד:
{"title":"...","summary":"...","goals":["..."],"sections":[{"name":"פתיחה","duration":"X דקות","description":"...","activities":["..."]},{"name":"גוף השיעור","duration":"X דקות","description":"...","activities":["..."]},{"name":"סיכום","duration":"X דקות","description":"...","activities":["..."]},{"name":"הערכה","duration":"משולב","description":"...","activities":["..."]}${form.extras.differentiation?`,{"name":"התאמות","duration":"","description":"...","activities":["לתלמידים הזקוקים לתמיכה: ...","לתלמידים ברמת ביניים: ...","לתלמידים עצמאיים: ..."]}`:``}${form.extras.thinking?`,{"name":"שאלות חשיבה","duration":"","description":"...","activities":["...","...","..."]}`:``}${form.extras.sel?`,{"name":"רכיבים חברתיים-רגשיים","duration":"","description":"...","activities":["...","..."]}`:``}],"materials":["..."],"teacherNotes":"..."}`;
  };

  const generate = async () => {
    if (!form.subject || !form.topic || !form.grade) { setError("נא למלא מקצוע, נושא וכיתה"); return; }
    setError(null); setLoading(true); setResult(null);
    try {
      const text  = await callAPI({ prompt: buildPrompt() });
      const clean = text.replace(/```json|```/g, "").trim();
      const match = clean.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("לא התקבל JSON תקין");
      setResult(JSON.parse(match[0]));
      setStep("result");
    } catch (e) { setError(`שגיאה: ${e.message}`); }
    finally { setLoading(false); }
  };

  if (step === "result" && result) return (
    <div style={S.container}>
      <div style={S.resultBanner}>
        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>{form.subject} | כיתה {form.grade} | {form.duration}</div>
        <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 700 }}>{result.title}</h2>
        <p style={{ margin: 0, opacity: 0.85, fontSize: 15, lineHeight: 1.6 }}>{result.summary}</p>
      </div>
      {result.goals?.length > 0 && (
        <Card title="מטרות השיעור">
          <ul style={{ margin: 0, paddingRight: 20, lineHeight: 2 }}>
            {result.goals.map((g, i) => <li key={i} style={{ color: "#333", fontSize: 15 }}>{g}</li>)}
          </ul>
        </Card>
      )}
      {result.sections?.map((sec, i) => (
        <Card key={i} title={`${sec.name}${sec.duration ? ` — ${sec.duration}` : ""}`}
          accent={sec.name === "פתיחה" ? "#1565c0" : sec.name === "גוף השיעור" ? "#1a237e" : "#37474f"}>
          <p style={{ margin: "0 0 12px", color: "#555", fontSize: 15, lineHeight: 1.7 }}>{sec.description}</p>
          {sec.activities?.map((a, j) => <div key={j} style={S.activity}>{a}</div>)}
        </Card>
      ))}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {result.materials?.length > 0 && <Card title="חומרים נדרשים" compact><ul style={{ margin: 0, paddingRight: 18, lineHeight: 2 }}>{result.materials.map((m, i) => <li key={i} style={{ fontSize: 14, color: "#444" }}>{m}</li>)}</ul></Card>}
        {result.teacherNotes && <Card title="הערות למורה" compact><p style={{ margin: 0, fontSize: 14, color: "#555", lineHeight: 1.7 }}>{result.teacherNotes}</p></Card>}
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={() => { setStep("form"); setResult(null); }} style={S.outlineBtn}>בנה מערך חדש</button>
        <button onClick={() => window.print()} style={S.primaryBtn}>הדפס / שמור PDF</button>
      </div>
    </div>
  );

  return (
    <div style={S.container}>
      <div style={S.formCard}>
        <h2 style={S.sectionTitle}>פרטי השיעור</h2>
        <div style={S.grid3}>
          <FF label="מקצוע *"><Sel value={form.subject} onChange={v => setForm(f=>({...f,subject:v}))} options={SUBJECTS} placeholder="בחר מקצוע" /></FF>
          <FF label="כיתה *"><Sel value={form.grade} onChange={v => setForm(f=>({...f,grade:v}))} options={GRADES} placeholder="בחר כיתה" /></FF>
          <FF label="משך"><Sel value={form.duration} onChange={v => setForm(f=>({...f,duration:v}))} options={DURATIONS} /></FF>
        </div>
        <FF label="נושא השיעור *"><input value={form.topic} onChange={e=>setForm(f=>({...f,topic:e.target.value}))} placeholder="לדוגמה: המהפכה המדעית במאה ה-17" style={S.input} /></FF>
        <FF label="מטרות (אופציונלי)"><textarea value={form.goals} onChange={e=>setForm(f=>({...f,goals:e.target.value}))} rows={3} style={{...S.input,resize:"vertical",lineHeight:1.6}} /></FF>
        <FF label="הרכב הכיתה">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {LEVELS.map(l => <button key={l} onClick={()=>setForm(f=>({...f,levels:l}))} style={{padding:"8px 16px",borderRadius:20,border:"2px solid",borderColor:form.levels===l?"#3949ab":"#e0e0e0",background:form.levels===l?"#e8eaf6":"white",color:form.levels===l?"#1a237e":"#666",cursor:"pointer",fontSize:13,fontWeight:form.levels===l?600:400}}>{l}</button>)}
          </div>
        </FF>
        <div style={S.extrasBox}>
          <div style={S.extrasTitle}>רכיבים נוספים</div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[{key:"differentiation",label:"התאמות לרמות שונות"},{key:"thinking",label:"שאלות חשיבה מסדר גבוה"},{key:"sel",label:"רכיבים חברתיים-רגשיים"}].map(({key,label})=>(
              <label key={key} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                <div onClick={()=>toggle(key)} style={{width:20,height:20,borderRadius:5,border:"2px solid",borderColor:form.extras[key]?"#3949ab":"#bdbdbd",background:form.extras[key]?"#3949ab":"white",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {form.extras[key]&&<span style={{color:"white",fontSize:12}}>✓</span>}
                </div>
                <span style={{fontSize:14,color:"#444"}}>{label}</span>
              </label>
            ))}
          </div>
        </div>
        {error && <div style={S.errorBox}>{error}</div>}
        <button onClick={generate} disabled={loading} style={{...S.primaryBtn,width:"100%",padding:"16px",opacity:loading?0.7:1}}>
          {loading ? "בונה מערך שיעור..." : "צור מערך שיעור"}
        </button>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Card({ title, children, accent = "#1a237e", compact }) {
  return (
    <div style={{ background:"white",borderRadius:14,boxShadow:"0 2px 12px rgba(0,0,0,0.06)",padding:compact?"20px 24px":"24px 28px",marginBottom:compact?0:16,borderTop:`3px solid ${accent}` }}>
      <h3 style={{ margin:"0 0 14px",fontSize:16,color:accent,fontWeight:700 }}>{title}</h3>
      {children}
    </div>
  );
}
function FF({ label, children }) {
  return <div style={{ marginBottom:20 }}><label style={{ display:"block",fontSize:13,fontWeight:600,color:"#444",marginBottom:8 }}>{label}</label>{children}</div>;
}
function Sel({ value, onChange, options, placeholder }) {
  return <select value={value} onChange={e=>onChange(e.target.value)} style={S.input}>{placeholder&&<option value="">{placeholder}</option>}{options.map(o=><option key={o} value={o}>{o}</option>)}</select>;
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  page:        { direction:"rtl",fontFamily:"'Segoe UI','Arial Hebrew',Arial,sans-serif",minHeight:"100vh",display:"flex",flexDirection:"column",background:"#f5f7ff" },
  header:      { background:"linear-gradient(90deg,#1a237e 0%,#283593 60%,#3949ab 100%)",color:"white",padding:"20px 40px 18px",boxShadow:"0 4px 24px rgba(26,35,126,0.18)",flexShrink:0 },
  headerInner: { maxWidth:860,margin:"0 auto" },
  headerSub:   { fontSize:12,opacity:0.7,marginBottom:3,letterSpacing:1 },
  headerTitle: { margin:0,fontSize:24,fontWeight:700 },
  headerDesc:  { fontSize:13,opacity:0.8,marginTop:4,marginBottom:16 },
  toggle:      { display:"inline-flex",background:"rgba(255,255,255,0.15)",borderRadius:24,padding:4,gap:4 },
  toggleBtn:   { padding:"7px 22px",borderRadius:20,border:"none",cursor:"pointer",fontSize:14,fontWeight:500,color:"rgba(255,255,255,0.75)",background:"transparent",transition:"all 0.2s" },
  toggleActive: { background:"white",color:"#1a237e",fontWeight:700,boxShadow:"0 2px 8px rgba(0,0,0,0.15)" },
  chatScroll:  { flex:1,overflowY:"auto" },
  chatInner:   { maxWidth:820,margin:"0 auto",padding:"24px 20px",display:"flex",flexDirection:"column",gap:16 },
  row:         { display:"flex",width:"100%" },
  bubble:      { padding:"14px 18px" },
  sender:      { fontSize:11,color:"#9fa8da",marginBottom:6,fontWeight:600,letterSpacing:0.5 },
  msgText:     { fontSize:15,lineHeight:1.75,whiteSpace:"pre-wrap",wordBreak:"break-word" },
  dot:         { width:8,height:8,borderRadius:"50%",background:"#9fa8da",display:"inline-block",animation:"bounce 1.2s infinite ease-in-out" },
  inputBar:    { background:"white",borderTop:"1px solid #e8eaf6",padding:"14px 20px",flexShrink:0,boxShadow:"0 -4px 16px rgba(0,0,0,0.05)" },
  inputInner:  { maxWidth:820,margin:"0 auto",display:"flex",gap:12,alignItems:"flex-end" },
  textarea:    { flex:1,padding:"12px 16px",borderRadius:12,border:"1.5px solid #e0e0e0",fontSize:15,color:"#333",fontFamily:"inherit",direction:"rtl",resize:"none",outline:"none",lineHeight:1.6 },
  centerFill:  { display:"flex",alignItems:"center",justifyContent:"center",flex:1,padding:"40px 20px" },
  welcomeBox:  { background:"white",borderRadius:20,padding:"48px 40px",boxShadow:"0 4px 32px rgba(0,0,0,0.08)",maxWidth:520,width:"100%",textAlign:"center" },
  chips:       { display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",marginBottom:32 },
  chip:        { padding:"8px 16px",background:"#e8eaf6",borderRadius:20,fontSize:13,color:"#3949ab",fontWeight:500 },
  container:   { maxWidth:860,margin:"0 auto",padding:"32px 20px",flex:1 },
  formCard:    { background:"white",borderRadius:16,boxShadow:"0 2px 24px rgba(0,0,0,0.08)",padding:"36px 40px" },
  sectionTitle: { margin:"0 0 28px",fontSize:18,color:"#1a237e",fontWeight:600 },
  grid3:       { display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:0 },
  input:       { width:"100%",padding:"10px 14px",borderRadius:8,border:"1.5px solid #e0e0e0",fontSize:14,color:"#333",background:"white",outline:"none",boxSizing:"border-box",fontFamily:"inherit",direction:"rtl" },
  extrasBox:   { background:"#f8f9ff",borderRadius:12,padding:"20px 24px",marginBottom:28,border:"1px solid #e8eaf6" },
  extrasTitle: { fontSize:14,fontWeight:600,color:"#1a237e",marginBottom:14 },
  errorBox:    { color:"#c62828",fontSize:13,marginBottom:16,padding:"10px 16px",background:"#ffebee",borderRadius:8 },
  activity:    { padding:"10px 14px",marginBottom:8,background:"#f8f9ff",borderRadius:8,fontSize:14,color:"#333",lineHeight:1.6,borderRight:"3px solid #7986cb" },
  resultBanner: { background:"linear-gradient(90deg,#1a237e,#3949ab)",color:"white",borderRadius:16,padding:"28px 36px",marginBottom:24 },
  primaryBtn:  { flex:1,padding:"14px 32px",borderRadius:12,border:"none",background:"linear-gradient(90deg,#1a237e,#3949ab)",color:"white",fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 16px rgba(57,73,171,0.3)" },
  outlineBtn:  { flex:1,padding:"14px 32px",borderRadius:12,border:"2px solid #3949ab",background:"white",color:"#1a237e",fontSize:15,fontWeight:600,cursor:"pointer" },
};
