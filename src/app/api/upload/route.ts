export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const VERSION = "v3"; // <-- visible at GET /api/upload

function sanitize(name: string) {
  return name.replace(/[^a-z0-9.\-_]/gi, "_");
}

export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/upload", version: VERSION });
}

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Save in /tmp on Vercel, ./uploads locally
  const dir = process.env.NODE_ENV === "production" ? "/tmp" : path.join(process.cwd(), "uploads");
  await fs.mkdir(dir, { recursive: true });

  const fileName = sanitize(file.name);
  const filePath = path.join(dir, fileName);
  await fs.writeFile(filePath, buffer);

  // Try to parse the PDF
  let numPages: number | undefined;
  let info: any = null;
  let preview: string | undefined;
  try {
    const pdfParse = (await import("pdf-parse")).default as any;
    const parsed = await pdfParse(buffer);
    numPages = parsed.numpages;
    info = parsed.info ?? null;
    preview = (parsed.text || "").slice(0, 1200);
  } catch (err: any) {
    // still return a response if parsing fails
    info = { parser: "skipped", error: String(err?.message || err) };
  }

  return NextResponse.json({
    ok: true,
    version: VERSION,
    fileName,
    savedAt: filePath,
    numPages,
    info,
    preview,
  });
}
