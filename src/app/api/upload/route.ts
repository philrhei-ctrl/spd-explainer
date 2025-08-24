export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

function sanitize(name: string) {
  return name.replace(/[^a-z0-9.\-_]/gi, "_");
}

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const dir =
    process.env.NODE_ENV === "production" ? "/tmp" : path.join(process.cwd(), "uploads");
  await fs.mkdir(dir, { recursive: true });

  const fileName = sanitize(file.name);
  const filePath = path.join(dir, fileName);
  await fs.writeFile(filePath, buffer);

  const pdfParse = (await import("pdf-parse")).default as any;
  const parsed = await pdfParse(buffer);
  const preview = (parsed.text || "").slice(0, 1200);

  return NextResponse.json({
    ok: true,
    fileName,
    savedAt: filePath,
    numPages: parsed.numpages,
    info: parsed.info ?? null,
    preview,
  });
}
