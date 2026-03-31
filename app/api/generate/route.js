import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";

function parseAndBuildDocx(text) {
  const lines = text.split("\n");
  const children = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      children.push(new Paragraph({ children: [], spacing: { before: 60, after: 60 } }));
      continue;
    }

    if (trimmed.startsWith("# ")) {
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: trimmed.slice(2), font: "Arial", bold: true, size: 36, color: "1A237E" })],
        alignment: AlignmentType.RIGHT, bidirectional: true, spacing: { before: 240, after: 160 }
      }));
    } else if (trimmed.startsWith("## ")) {
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: trimmed.slice(3), font: "Arial", bold: true, size: 28, color: "1565C0" })],
        alignment: AlignmentType.RIGHT, bidirectional: true, spacing: { before: 200, after: 120 }
      }));
    } else if (trimmed.startsWith("### ")) {
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun({ text: trimmed.slice(4), font: "Arial", bold: true, size: 26, color: "283593" })],
        alignment: AlignmentType.RIGHT, bidirectional: true, spacing: { before: 160, after: 80 }
      }));
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      children.push(new Paragraph({
        children: [new TextRun({ text: "• " + trimmed.slice(2), font: "Arial", size: 24 })],
        alignment: AlignmentType.RIGHT, bidirectional: true,
        indent: { right: 400 }, spacing: { before: 60, after: 60 }
      }));
    } else if (/^\d+\.\s/.test(trimmed)) {
      children.push(new Paragraph({
        children: [new TextRun({ text: trimmed, font: "Arial", size: 24 })],
        alignment: AlignmentType.RIGHT, bidirectional: true,
        indent: { right: 400 }, spacing: { before: 80, after: 80 }
      }));
    } else {
      const runs = [];
      const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
      for (const part of parts) {
        if (part.startsWith("**") && part.endsWith("**")) {
          runs.push(new TextRun({ text: part.slice(2, -2), font: "Arial", size: 24, bold: true }));
        } else if (part) {
          runs.push(new TextRun({ text: part, font: "Arial", size: 24 }));
        }
      }
      children.push(new Paragraph({
        children: runs, alignment: AlignmentType.RIGHT,
        bidirectional: true, spacing: { before: 60, after: 60 }
      }));
    }
  }

  return new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 24 } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 36, bold: true, font: "Arial", color: "1A237E" },
          paragraph: { spacing: { before: 240, after: 160 }, alignment: AlignmentType.RIGHT, bidirectional: true } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 28, bold: true, font: "Arial", color: "1565C0" },
          paragraph: { spacing: { before: 200, after: 120 }, alignment: AlignmentType.RIGHT, bidirectional: true } },
        { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 26, bold: true, font: "Arial", color: "283593" },
          paragraph: { spacing: { before: 160, after: 80 }, alignment: AlignmentType.RIGHT, bidirectional: true } },
      ],
    },
    sections: [{ properties: {
      page: { size: { width: 11906, height: 16838 }, margin: { top: 1300, right: 1800, bottom: 1300, left: 1440 } }
    }, children }]
  });
}

export async function POST(req) {
  const { messages, system, prompt, generateWord } = await req.json();
  const apiMessages = messages || [{ role: "user", content: prompt }];
  const body = { model: "claude-sonnet-4-20250514", max_tokens: 4000, messages: apiMessages };
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

  if (generateWord) {
    try {
      const doc = parseAndBuildDocx(text);
      const buffer = await Packer.toBuffer(doc);
      return new Response(buffer, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": "attachment; filename*=UTF-8''%D7%9E%D7%98%D7%9C%D7%94.docx",
        },
      });
    } catch (e) {
      return Response.json({ error: "שגיאה ביצירת קובץ Word", text }, { status: 500 });
    }
  }

  return Response.json({ text });
}
