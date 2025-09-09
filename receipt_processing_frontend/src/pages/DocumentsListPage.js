import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentActions, useDocumentState } from '../context/DocumentContext';
import Api from '../services/api';
import Filters from '../components/Filters';
import Paginator from '../components/Paginator';
import StatusPill from '../components/StatusPill';

// PUBLIC_INTERFACE
export default function DocumentsListPage() {
  /** Paginated list of documents with basic filters. */
  const { state } = useDocumentState();
  const { setDocuments, setFilters, setPagination } = useDocumentActions();
  const [loading, setLoading] = useState(false);

  const fetchDocs = async (filters = state.filters, pagination = state.pagination) => {
    setLoading(true);
    try {
      const res = await Api.searchDocuments({
        ...filters,
        page: pagination.page,
        pageSize: pagination.pageSize,
      });
      const items = res.items || res.results || res.data || [];
      const total = res.total || res.count || items.length;
      setDocuments(items, total, pagination.page, pagination.pageSize);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (f) => { setFilters(f); setPagination({ page: 1 }); fetchDocs(f, { ...state.pagination, page: 1 }); };
  const onPageChange = (page) => { setPagination({ page }); fetchDocs(state.filters, { ...state.pagination, page }); };

  return (
    <div className="container">
      <h2>Documents</h2>
      <Filters value={state.filters} onChange={setFilters} onSubmit={onSubmit} showAdvanced={false} />
      {loading ? <p>Loading...</p> : (
        <>
          <div style={{ overflowX: 'auto', marginTop: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: 8 }}>ID</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Vendor</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Date</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Amount</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Category</th>
                  <th style={{ textAlign: 'left,', padding: 8 }}>Status</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {state.documents.map((d) => (
                  <tr key={d.id || d._id}>
                    <td style={{ padding: 8 }}>{d.id || d._id}</td>
                    <td style={{ padding: 8 }}>{d.vendor || d.merchant || '-'}</td>
                    <td style={{ padding: 8 }}>{d.date ? new Date(d.date).toLocaleDateString() : '-'}</td>
                    <td style={{ padding: 8 }}>{d.totalAmount ?? d.amount ?? '-'}</td>
                    <td style={{ padding: 8 }}>{d.category || '-'}</td>
                    <td style={{ padding: 8 }}><StatusPill status={d.status} /></td>
                    <td style={{ padding: 8 }}>
                      <Link to={`/documents/${encodeURIComponent(d.id || d._id)}`}>View</Link>
                    </td>
                  </tr>
                ))}
                {state.documents.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: 8, textAlign: 'center' }}>No documents.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Paginator page={state.pagination.page} pageSize={state.pagination.pageSize} total={state.pagination.total} onChange={onPageChange} />
        </>
      )}
    </div>
  );
}
