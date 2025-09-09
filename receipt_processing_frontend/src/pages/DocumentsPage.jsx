import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";

// PUBLIC_INTERFACE
/**
 * DocumentsPage - Placeholder for listing documents.
 * Includes minimal loading and error state stubs for integration testing.
 */
export default function DocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        // Placeholder fetch; to be aligned with backend routes later.
        const resp = await apiClient.get("/api/documents");
        if (mounted) setDocs(Array.isArray(resp) ? resp : []);
      } catch (e) {
        if (mounted) setError(e?.message || "Failed to load documents");
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
      <h2>Documents</h2>
      <p className="description">Browse your uploaded and processed documents.</p>
      {loading && <p aria-label="loading-state">Loading...</p>}
      {error && (
        <p aria-label="error-state" style={{ color: "crimson" }}>
          {error}
        </p>
      )}
      {!loading && !error && docs.length === 0 && <p>No documents yet.</p>}
      <ul style={{ paddingLeft: 20 }}>
        {docs.map((d) => (
          <li key={d.id || d._id}>
            <Link to={`/documents/${d.id || d._id}`}>{d.name || d.filename || "Untitled"}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
