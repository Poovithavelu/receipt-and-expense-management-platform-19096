import React from 'react';
import UploadWidget from '../components/UploadWidget';
import { useDocumentState } from '../context/DocumentContext';
import StatusPill from '../components/StatusPill';

// PUBLIC_INTERFACE
export default function UploadPage() {
  /** Page for uploading one or more documents and viewing the local upload queue. */
  const { state } = useDocumentState();
  const queue = state.uploadQueue;

  return (
    <div className="container">
      <h2>Upload Documents</h2>
      <UploadWidget onUploaded={() => { /* optional hook */ }} />
      {queue.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3>Upload Queue</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {queue.map((u) => (
              <div key={u.tempId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--border-color, #e9ecef)', borderRadius: 8, padding: 12 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{u.file?.name}</div>
                  <small>{Math.round((u.file?.size || 0) / 1024)} KB</small>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 120, height: 8, background: '#eee', borderRadius: 8, overflow: 'hidden' }}>
                    <div style={{ width: `${u.progress || 0}%`, height: '100%', background: '#007bff' }} />
                  </div>
                  <StatusPill status={u.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
