import { useState } from "react";
import { getProcessingStatus } from "../services/api";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import Card from "../components/Card";

export default function ProcessingStatusPage() {
  const [docId, setDocId] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  async function checkStatus(e) {
    e.preventDefault();
    if (!docId) return;
    setLoading(true);
    setError("");
    setStatus(null);
    try {
      const data = await getProcessingStatus(docId);
      setStatus(data);
    } catch (err) {
      setError(err?.payload?.message || err.message || "Failed to fetch status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h2>Processing Status</h2>
      <Card>
        <form onSubmit={checkStatus} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input style={{ flex: 1, minWidth: 240 }} placeholder="Enter Document ID" value={docId} onChange={(e) => setDocId(e.target.value)} />
          <button className="theme-toggle" type="submit" disabled={!docId || loading}>
            Check
          </button>
        </form>
      </Card>

      {loading && <Loader text="Fetching status..." />}
      {error && <div style={{ marginTop: 16 }}><ErrorState description={error} /></div>}
      {status && (
        <div style={{ marginTop: 16 }}>
          <Card header={`Document: ${docId}`}>
            <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(status, null, 2)}</pre>
          </Card>
        </div>
      )}
    </div>
  );
}
