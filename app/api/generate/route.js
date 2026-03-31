export async function POST(req) {
  const { messages, system, prompt } = await req.json();

  const apiMessages = messages || [{ role: "user", content: prompt }];

  const body = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    messages: apiMessages,
  };

  if (system) body.system = system;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    return Response.json({ error: data.error?.message || "שגיאת שרת" }, { status: 500 });
  }

  const text = data.content?.map((i) => i.text || "").join("") || "";
  return Response.json({ text });
}
