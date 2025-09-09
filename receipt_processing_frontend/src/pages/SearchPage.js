import React, { useState } from 'react';
import Filters from '../components/Filters';
import Api from '../services/api';
import StatusPill from '../components/StatusPill';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function SearchPage() {
  /** Search documents with advanced filters and show quick results. */
  const [filters, setFilters] = useState({});
  const [results, setResults] = useState([]);
  const [meta, setMeta] = useState({ total: 0 });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (f) => {
    setLoading(true);
    try {
      const res = await Api.searchDocuments({ ...f, page: 1, pageSize: 25 });
      const items = res.items || res.results || res.data || [];
      setResults(items);
      setMeta({ total: res.total || items.length });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Search</h2>
      <Filters value={filters} onChange={setFilters} onSubmit={onSubmit} showAdvanced />
      {loading ? <p>Searching...</p> : (
        <>
          <div style={{ marginTop: 12 }}>
            <small>{meta.total} results</small>
          </div>
          <div style={{ display: 'grid', gap: 12, marginTop: 8 }}>
            {results.map((d) => (
              <div key={d.id || d._id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center', border: '1px solid var(--border-color, #e9ecef)', borderRadius: 8, padding: 12 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{d.vendor || d.merchant || 'Unknown Vendor'}</div>
                  <small>{d.date ? new Date(d.date).toLocaleDateString() : '-'}</small> · <small>Amount: {d.totalAmount ?? d.amount ?? '-'}</small> · <small>Category: {d.category || '-'}</small>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <StatusPill status={d.status} />
                  <Link to={`/documents/${encodeURIComponent(d.id || d._id)}`}>Open</Link>
                </div>
              </div>
            ))}
            {results.length === 0 && <p>No results. Try adjusting filters.</p>}
          </div>
        </>
      )}
    </div>
  );
}
