import React, { useEffect } from 'react';
import { useDocumentActions, useDocumentState, usePolling } from '../context/DocumentContext';
import Api from '../services/api';
import StatusPill from '../components/StatusPill';

// PUBLIC_INTERFACE
export default function ProcessingPage() {
  /** Shows in-progress documents with auto-polling for status updates. */
  const { state } = useDocumentState();
  const { updateProcessing } = useDocumentActions();

  const processingIds = Object.keys(state.processing || {}).filter((id) => {
    const s = state.processing[id]?.status;
    return s === 'queued' || s === 'processing' || s === 'uploaded';
  });

  const poll = async () => {
    for (const id of processingIds) {
      try {
        const res = await Api.getStatus(id);
        updateProcessing(id, { ...res, lastUpdate: Date.now() });
      } catch (e) {
        updateProcessing(id, { error: e.message, lastUpdate: Date.now() });
      }
    }
  };

  usePolling(poll, processingIds.length > 0 ? 3000 : null, [processingIds.join(',')]);

  useEffect(() => {
    // Initially, we could add recently uploaded items to processing map if they have backendId
    state.uploadQueue.forEach((u) => {
      if (u.backendId && !state.processing[u.backendId]) {
        updateProcessing(u.backendId, { status: 'uploaded', progress: 0 });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.uploadQueue.map((u) => u.backendId).join(',')]);

  return (
    <div className="container">
      <h2>Processing</h2>
      {processingIds.length === 0 ? (
        <p>No documents currently processing.</p>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {processingIds.map((id) => {
            const item = state.processing[id];
            return (
              <div key={id} style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid var(--border-color, #e9ecef)', borderRadius: 8, padding: 12 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>Document #{id}</div>
                  <small>Last update: {item.lastUpdate ? new Date(item.lastUpdate).toLocaleTimeString() : '-'}</small>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 140, height: 8, background: '#eee', borderRadius: 8, overflow: 'hidden' }}>
                    <div style={{ width: `${item.progress ?? 0}%`, height: '100%', background: '#f0ad4e' }} />
                  </div>
                  <StatusPill status={item.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
