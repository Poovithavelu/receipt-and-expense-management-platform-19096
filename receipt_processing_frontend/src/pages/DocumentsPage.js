import { useEffect, useState } from "react";
import { listDocuments, getDocument, updateDocument, deleteDocument } from "../services/api";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import Card from "../components/Card";
import Pagination from "../components/Pagination";

export default function DocumentsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({ items: [], total: 0 });
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page, pageSize]);

  async function fetchData() {
    setLoading(true);
    setError("");
    try {
      const res = await listDocuments({ q, page, pageSize, status, category });
      setData({
        items: res?.items || res?.data || [],
        total: res?.total || 0,
      });
    } catch (err) {
      setError(err?.payload?.message || err.message || "Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  }

  async function openDetail(id) {
    setSelected(id);
    setDetail(null);
    try {
      const res = await getDocument(id);
      setDetail(res);
    } catch (err) {
      setDetail({ error: err?.payload?.message || err.message || "Failed to fetch document" });
    }
  }

  async function saveEdits() {
    if (!detail || !selected) return;
    setSaving(true);
    try {
      const payload = { category: detail.category || "", notes: detail.notes || "" };
      await updateDocument(selected, payload);
      await openDetail(selected);
      await fetchData();
    } catch (err) {
      alert(err?.payload?.message || err.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  async function deleteDoc() {
    if (!selected) return;
    if (!window.confirm("Delete this document?")) return;
    setDeleting(true);
    try {
      await deleteDocument(selected);
      setSelected(null);
      setDetail(null);
      await fetchData();
    } catch (err) {
      alert(err?.payload?.message || err.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  function onSearch(e) {
    e.preventDefault();
    setPage(1);
    fetchData();
  }

  return (
    <div className="container" style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <h2>Documents</h2>
      <form onSubmit={onSearch} style={{ display: "grid", gridTemplateColumns: "1fr 180px 180px 120px", gap: 8, marginBottom: 12 }}>
        <input placeholder="Search receipts, vendors, totals..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="UPLOADED">Uploaded</option>
          <option value="PROCESSING">Processing</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
        </select>
        <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <button className="theme-toggle" type="submit">Search</button>
      </form>

      {loading && <Loader text="Loading documents..." />}
      {error && <ErrorState description={error} />}

      {!loading && !error && (data.items?.length ? (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
          <div style={{ display: "grid", gap: 8 }}>
            {data.items.map((doc) => (
              <Card key={doc.id || doc._id} header={`${doc.vendor || doc.title || "Document"} · ${doc.total ? `$${doc.total}` : ""}`}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 14, opacity: 0.8 }}>
                    <div>ID: {doc.id || doc._id}</div>
                    <div>Status: {doc.status}</div>
                    <div>Date: {doc.date || doc.createdAt}</div>
                    <div>Category: {doc.category || "-"}</div>
                  </div>
                  <div>
                    <button className="theme-toggle" onClick={() => openDetail(doc.id || doc._id)}>View</button>
                  </div>
                </div>
              </Card>
            ))}
            <Pagination page={page} pageSize={pageSize} total={data.total} onPageChange={setPage} />
          </div>

          <div>
            <Card header="Details">
              {!selected && <div style={{ opacity: 0.7 }}>Select a document to view details</div>}
              {selected && !detail && <Loader text="Loading details..." />}
              {selected && detail?.error && <ErrorState description={detail.error} />}
              {selected && detail && !detail.error && (
                <div style={{ display: "grid", gap: 8 }}>
                  <label>
                    <div>Vendor</div>
                    <input value={detail.vendor || ""} disabled />
                  </label>
                  <label>
                    <div>Total</div>
                    <input value={detail.total || ""} disabled />
                  </label>
                  <label>
                    <div>Category</div>
                    <input value={detail.category || ""} onChange={(e) => setDetail({ ...detail, category: e.target.value })} />
                  </label>
                  <label>
                    <div>Notes</div>
                    <textarea rows={3} value={detail.notes || ""} onChange={(e) => setDetail({ ...detail, notes: e.target.value })} />
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="theme-toggle" disabled={saving} onClick={saveEdits}>{saving ? "Saving..." : "Save"}</button>
                    <button className="theme-toggle" style={{ background: "crimson" }} disabled={deleting} onClick={deleteDoc}>
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                  <details>
                    <summary>Raw</summary>
                    <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(detail, null, 2)}</pre>
                  </details>
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : (
        <EmptyState title="No documents" description="Try uploading a receipt or adjust your search filters." />
      ))}
    </div>
  );
}
