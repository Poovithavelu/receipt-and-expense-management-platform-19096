import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/client";

// PUBLIC_INTERFACE
/**
 * DocumentDetailPage - Placeholder for a single document detail view.
 * Includes minimal loading and error state stubs for integration testing.
 */
export default function DocumentDetailPage() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const resp = await apiClient.get(`/api/documents/${id}`);
        if (mounted) setDoc(resp);
      } catch (e) {
        if (mounted) setError(e?.message || "Failed to load document");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <div className="container" style={{ padding: 24, textAlign: "left" }}>
      <h2>Document Detail</h2>
      {loading && <p aria-label="loading-state">Loading...</p>}
      {error && (
        <p aria-label="error-state" style={{ color: "crimson" }}>
          {error}
        </p>
      )}
      {!loading && !error && doc && (
        <div aria-label="document-detail">
          <p><strong>ID:</strong> {doc.id || doc._id || id}</p>
          <p><strong>Name:</strong> {doc.name || doc.filename || "Untitled"}</p>
          <p><strong>Status:</strong> {doc.status || "Unknown"}</p>
        </div>
      )}
    </div>
  );
}
