import React, { useEffect, useState } from "react";
import apiClient from "../api/client";

// PUBLIC_INTERFACE
/**
 * AdminDashboard - Placeholder admin view with basic statistics.
 * Includes minimal loading and error state stubs for integration testing.
 */
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        // Placeholder endpoint; to be finalized with backend.
        const resp = await apiClient.get("/api/admin/stats");
        if (mounted) setStats(resp);
      } catch (e) {
        if (mounted) setError(e?.message || "Failed to load stats");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="container" style={{ padding: 24, textAlign: "left" }}>
      <h2>Admin Dashboard</h2>
      {loading && <p aria-label="loading-state">Loading...</p>}
      {error && (
        <p aria-label="error-state" style={{ color: "crimson" }}>
          {error}
        </p>
      )}
      {!loading && !error && stats && (
        <div aria-label="admin-stats">
          <pre style={{ background: "#f7f7f7", padding: 12, borderRadius: 8, overflow: "auto" }}>
            {JSON.stringify(stats, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
