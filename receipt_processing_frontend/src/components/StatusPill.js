import React from 'react';

// PUBLIC_INTERFACE
export default function StatusPill({ status }) {
  /** Displays a colored pill based on status string. */
  const normalized = (status || '').toLowerCase();
  const map = {
    queued: { bg: '#e2e3e5', color: '#343a40' },
    uploading: { bg: '#cfe2ff', color: '#084298' },
    uploaded: { bg: '#d1e7dd', color: '#0f5132' },
    processing: { bg: '#fff3cd', color: '#664d03' },
    completed: { bg: '#d1e7dd', color: '#0f5132' },
    failed: { bg: '#f8d7da', color: '#842029' },
    error: { bg: '#f8d7da', color: '#842029' },
  };
  const style = map[normalized] || { bg: '#e2e3e5', color: '#343a40' };
  return (
    <span style={{ background: style.bg, color: style.color, padding: '2px 8px', borderRadius: 999, fontSize: 12 }}>
      {status || 'unknown'}
    </span>
  );
}
