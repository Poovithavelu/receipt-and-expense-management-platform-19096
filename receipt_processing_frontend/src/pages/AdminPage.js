import { useEffect, useState } from "react";
import { getAdminStats } from "../services/api";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import Card from "../components/Card";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await getAdminStats();
      setStats(res);
    } catch (err) {
      setError(err?.payload?.message || err.message || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container" style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <h2>Admin & Stats</h2>
      {loading && <Loader text="Loading stats..." />}
      {error && <ErrorState description={error} onRetry={load} />}
      {!loading && !error && stats && (
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))" }}>
            <Card header="Total Documents">
              <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.totalDocuments ?? "-"}</div>
            </Card>
            <Card header="Processing">
              <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.processing ?? "-"}</div>
            </Card>
            <Card header="Completed">
              <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.completed ?? "-"}</div>
            </Card>
            <Card header="Failed">
              <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.failed ?? "-"}</div>
            </Card>
          </div>

          <Card header="System">
            <ul>
              <li>OCR Worker Status: <strong>{stats.ocrWorkerStatus || "unknown"}</strong></li>
              <li>Average Processing Time: <strong>{stats.avgProcessingTime ? `${stats.avgProcessingTime} s` : "-"}</strong></li>
              <li>Last Updated: <strong>{stats.lastUpdated || "-"}</strong></li>
            </ul>
          </Card>

          <Card header="Raw">
            <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(stats, null, 2)}</pre>
          </Card>
        </div>
      )}
    </div>
  );
}
