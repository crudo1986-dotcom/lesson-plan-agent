export const metadata = {
  title: "בונה מערכי שיעור",
  description: "כלי AI לבניית מערכי שיעור מותאמים אישית",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
