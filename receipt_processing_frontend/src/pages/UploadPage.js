import { useState } from "react";
import { uploadDocument } from "../services/api";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import Card from "../components/Card";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    if (!file) return;
    setIsUploading(true);
    setError("");
    setResult(null);
    try {
      const data = await uploadDocument(file, { category, notes });
      setResult(data);
    } catch (err) {
      setError(err?.payload?.message || err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="container" style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h2>Upload Document</h2>
      <Card>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <label>
            <div style={{ marginBottom: 6 }}>File</div>
            <input type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
          </label>
          <label>
            <div style={{ marginBottom: 6 }}>Category (optional)</div>
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Meals, Travel, Office" />
          </label>
          <label>
            <div style={{ marginBottom: 6 }}>Notes (optional)</div>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Description or notes about this receipt" rows={3} />
          </label>
          <div>
            <button className="theme-toggle" type="submit" disabled={!file || isUploading}>
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </Card>

      {isUploading && <Loader text="Uploading file..." />}
      {error && <div style={{ marginTop: 16 }}><ErrorState description={error} /></div>}
      {result && (
        <div style={{ marginTop: 16 }}>
          <Card header="Upload Result">
            <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(result, null, 2)}</pre>
          </Card>
        </div>
      )}
    </div>
  );
}
