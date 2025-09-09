import React, { useState } from "react";
import apiClient from "../api/client";

// PUBLIC_INTERFACE
/**
 * UploadPage - Placeholder for document uploads.
 * Includes minimal loading and error state stubs for integration testing.
 */
export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  const onFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
    setError("");
    setResult("");
  };

  const onUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    setLoading(true);
    setError("");
    setResult("");
    try {
      const form = new FormData();
      form.append("file", file);
      // Placeholder endpoint; backend integration to be wired later.
      const resp = await apiClient.post("/api/documents/upload", form);
      setResult(`Uploaded. ID: ${resp?.id || "N/A"}`);
    } catch (e) {
      setError(e?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: 24, textAlign: "left" }}>
      <h2>Upload Document</h2>
      <p className="description">Select a receipt or invoice to upload and process.</p>

      <div style={{ marginTop: 16, marginBottom: 8 }}>
        <input type="file" onChange={onFileChange} aria-label="file-input" />
      </div>

      <button className="btn" onClick={onUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {loading && <p aria-label="loading-state">Loading...</p>}
      {error && (
        <p aria-label="error-state" style={{ color: "crimson", marginTop: 12 }}>
          {error}
        </p>
      )}
      {result && (
        <p aria-label="success-state" style={{ color: "green", marginTop: 12 }}>
          {result}
        </p>
      )}
    </div>
  );
}
