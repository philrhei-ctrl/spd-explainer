"use client";
import { useState } from "react";

type Result = {
  ok?: boolean;
  fileName?: string;
  savedAt?: string;
  numPages?: number;
  info?: any;
  preview?: string;
  error?: string;
};

export default function UploadPage() {
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = (await res.json()) as Result;
    setResult(data);
    setBusy(false);
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Upload an SPD PDF</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" name="file" accept="application/pdf" required />
        <button type="submit" style={{ marginLeft: 12 }} disabled={busy}>
          {busy ? "Uploading…" : "Upload"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: 24 }}>
          {result.error && <p style={{ color: "crimson" }}>{result.error}</p>}
          {result.ok && (
            <>
              <p><b>File:</b> {result.fileName}</p>
              <p><b>Pages:</b> {result.numPages}</p>
              {result.info && (
                <details>
                  <summary><b>PDF metadata</b></summary>
                  <pre>{JSON.stringify(result.info, null, 2)}</pre>
                </details>
              )}
              {result.preview && (
                <>
                  <h3>Text preview</h3>
                  <pre style={{ whiteSpace: "pre-wrap" }}>{result.preview}</pre>
                </>
              )}
            </>
          )}
        </div>
      )}
    </main>
  );
}
