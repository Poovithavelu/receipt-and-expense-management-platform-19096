import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Api from '../services/api';
import KeyValue from '../components/KeyValue';
import StatusPill from '../components/StatusPill';

// PUBLIC_INTERFACE
export default function DocumentDetailsPage() {
  /** Detailed view for a document with OCR results and version history. */
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const d = await Api.getDocumentDetails(id);
      setDoc(d);
      const v = await Api.getDocumentVersions(id);
      setVersions(v.items || v || []);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id]);

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (!doc) return <div className="container"><p>Document not found.</p></div>;

  const kv = [
    ['Vendor', doc.vendor || doc.merchant],
    ['Date', doc.date ? new Date(doc.date).toLocaleDateString() : '-'],
    ['Total Amount', doc.totalAmount ?? doc.amount],
    ['Tax', doc.tax],
    ['Currency', doc.currency],
    ['Category', doc.category],
    ['Payment Method', doc.paymentMethod],
    ['Status', <StatusPill key="status" status={doc.status} />],
  ];

  const fields = doc.extractedFields || doc.ocr || {};
  const fieldsArr = Object.entries(fields);

  return (
    <div className="container">
      <div style={{ marginBottom: 12 }}>
        <Link to="/documents">← Back to list</Link>
      </div>
      <h2>Document #{id}</h2>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr', marginTop: 12 }}>
        <section style={{ border: '1px solid var(--border-color, #e9ecef)', borderRadius: 8, padding: 12 }}>
          <h3>Summary</h3>
          {kv.map(([k, v]) => <KeyValue key={k} label={k} value={v} />)}
        </section>

        <section style={{ border: '1px solid var(--border-color, #e9ecef)', borderRadius: 8, padding: 12 }}>
          <h3>Extracted Fields</h3>
          {fieldsArr.length === 0 && <p>No extracted fields available.</p>}
          {fieldsArr.map(([k, v]) => <KeyValue key={k} label={k} value={`${v}`} />)}
        </section>

        <section style={{ border: '1px solid var(--border-color, #e9ecef)', borderRadius: 8, padding: 12 }}>
          <h3>Versions</h3>
          {versions.length === 0 ? <p>No versions.</p> : (
            <div style={{ display: 'grid', gap: 8 }}>
              {versions.map((ver) => (
                <div key={ver.id || ver.version || ver._id} style={{ display: 'flex', justifyContent: 'space-between', padding: 8, border: '1px solid var(--border-color,#e9ecef)', borderRadius: 6 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>v{ver.version ?? ver.id}</div>
                    <small>{ver.createdAt ? new Date(ver.createdAt).toLocaleString() : '-'}</small>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div>Changes: {ver.changes || '-'}</div>
                    <div>Status: <StatusPill status={ver.status || doc.status} /></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
