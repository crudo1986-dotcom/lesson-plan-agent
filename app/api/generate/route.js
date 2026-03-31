import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { createRequire } from "module";

function buildDoc(text) {
  const lines = text.split("\n");
  const children = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      children.push(new Paragraph({ children: [new TextRun({ text: "", font: "Arial", rtl: true })], bidirectional: true, spacing: { before: 40, after: 40 } }));
      continue;
    }
    if (t.startsWith("# ")) {
      children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: t.slice(2), font: "Arial", bold: true, size: 36, color: "1A237E", rtl: true })], alignment: AlignmentType.RIGHT, bidirectional: true, spacing: { before: 280, after: 160 } }));
    } else if (t.startsWith("## ")) {
      children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: t.slice(3), font: "Arial", bold: true, size: 28, color: "1565C0", rtl: true })], alignment: AlignmentType.RIGHT, bidirectional: true, spacing: { before: 220, after: 120 } }));
    } else if (t.startsWith("### ")) {
      children.push(new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: t.slice(4), font: "Arial", bold: true, size: 26, color: "283593", rtl: true })], alignment: AlignmentType.RIGHT, bidirectional: true, spacing: { before: 180, after: 80 } }));
    } else if (t.startsWith("- ") || t.startsWith("• ")) {
      children.push(new Paragraph({ children: [new TextRun({ text: "• " + t.slice(2), font: "Arial", size: 24, rtl: true })], alignment: AlignmentType.RIGHT, bidirectional: true, indent: { right: 400 }, spacing: { before: 60, after: 60 } }));
    } else {
      const parts = t.split(/(\*\*[^*]+\*\*)/g);
      const runs = parts.filter(Boolean).map(p =>
        p.startsWith("**") && p.endsWith("**")
          ? new TextRun({ text: p.slice(2, -2), font: "Arial", size: 24, bold: true, rtl: true })
          : new TextRun({ text: p, font: "Arial", size: 24, rtl: true })
      );
      children.push(new Paragraph({ children: runs, alignment: AlignmentType.RIGHT, bidirectional: true, spacing: { before: 60, after: 60 } }));
    }
  }
  return new Document({
    styles: { default: { document: { run: { font: "Arial", size: 24, rtl: true }, paragraph: { alignment: AlignmentType.RIGHT, bidirectional: true } } } },
    sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1300, right: 1800, bottom: 1300, left: 1440 } } }, children }]
  });
}

function fixRtlXml(xml) {
  // תיקון pPr
  xml = xml.replace(/<w:pPr>([\s\S]*?)<\/w:pPr>/g, (_, inner) => {
    let f = inner.replace(/<w:bidi\/>/g, "").replace(/<w:jc [^/]*\/>/g, "").trim();
    const bp = f.search(/<w:(?:spacing|ind|rPr)\b/);
    f = bp >= 0 ? f.slice(0, bp) + "<w:bidi/>" + f.slice(bp) : f + "<w:bidi/>";
    const jp = f.search(/<w:rPr\b/);
    f = jp >= 0 ? f.slice(0, jp) + '<w:jc w:val="right"/>' + f.slice(jp) : f + '<w:jc w:val="right"/>';
    return `<w:pPr>${f}</w:pPr>`;
  });
  // תיקון rPr
  xml = xml.replace(/<w:rPr>([\s\S]*?)<\/w:rPr>/g, (m, i) =>
    i.includes("<w:rtl/>") ? m : `<w:rPr>${i}<w:rtl/></w:rPr>`
  );
  // run ללא rPr
  xml = xml.replace(/(<w:r>)(\s*)(<w:t)/g, "$1$2<w:rPr><w:rtl/></w:rPr>$3");
  return xml;
}

async function fixRtlBuffer(buffer) {
  const AdmZip = (await import("adm-zip")).default;
  const zip = new AdmZip(Buffer.from(buffer));
  const entry = zip.getEntry("word/document.xml");
  if (!entry) throw new Error("document.xml not found");
  let xml = entry.getData().toString("utf8");
  xml = fixRtlXml(xml);
  zip.updateFile("word/document.xml", Buffer.from(xml, "utf8"));
  return zip.toBuffer();
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
      const doc = buildDoc(text);
      const rawBuffer = await Packer.toBuffer(doc);
      const fixedBuffer = await fixRtlBuffer(rawBuffer);
      return new Response(fixedBuffer, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": "attachment; filename*=UTF-8''%D7%9E%D7%98%D7%9C%D7%94.docx",
        },
      });
    } catch (e) {
      return Response.json({ error: "שגיאה ביצירת Word: " + e.message, text }, { status: 500 });
    }
  }

  return Response.json({ text });
}
