import React from 'react';

// PUBLIC_INTERFACE
export default function KeyValue({ label, value }) {
  /** Key-value row used in details/versions list. */
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '6px 0', borderBottom: '1px dashed var(--border-color, #e9ecef)' }}>
      <div style={{ opacity: 0.8 }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value ?? '-'}</div>
    </div>
  );
}
