"use client";
import { useState } from "react";

export default function UploadPage() {
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setMessage(JSON.stringify(data, null, 2));
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Upload an SPD PDF</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" name="file" accept="application/pdf" required />
        <button type="submit" style={{ marginLeft: 12 }}>Upload</button>
      </form>
      {message && <pre style={{ marginTop: 16 }}>{message}</pre>}
    </main>
  );
}
