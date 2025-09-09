import React from 'react';

// PUBLIC_INTERFACE
export default function Paginator({ page, pageSize, total, onChange }) {
  /** Simple paginator with previous/next controls. */
  const totalPages = Math.max(1, Math.ceil((total || 0) / (pageSize || 1)));
  const prev = () => onChange && onChange(Math.max(1, (page || 1) - 1));
  const next = () => onChange && onChange(Math.min(totalPages, (page || 1) + 1));

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'flex-end', marginTop: 12 }}>
      <button className="btn" onClick={prev} disabled={(page || 1) <= 1}>Prev</button>
      <span>Page {(page || 1)} / {totalPages}</span>
      <button className="btn" onClick={next} disabled={(page || 1) >= totalPages}>Next</button>
    </div>
  );
}
