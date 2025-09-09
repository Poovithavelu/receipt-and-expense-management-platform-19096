import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
export default function Filters({ value, onChange, onSubmit, showAdvanced = true }) {
  /** Filter form for searching documents. */
  const [local, setLocal] = useState(value || {});
  useEffect(() => setLocal(value || {}), [value]);

  const set = (k, v) => {
    const next = { ...local, [k]: v };
    setLocal(next);
    onChange && onChange(next);
  };

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(local); }}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, alignItems: 'end' }}
    >
      <div>
        <label>Query</label>
        <input value={local.query || ''} onChange={(e) => set('query', e.target.value)} placeholder="Vendor, notes, etc." />
      </div>
      <div>
        <label>Date From</label>
        <input type="date" value={local.dateFrom || ''} onChange={(e) => set('dateFrom', e.target.value)} />
      </div>
      <div>
        <label>Date To</label>
        <input type="date" value={local.dateTo || ''} onChange={(e) => set('dateTo', e.target.value)} />
      </div>
      <div>
        <label>Vendor</label>
        <input value={local.vendor || ''} onChange={(e) => set('vendor', e.target.value)} placeholder="e.g., Amazon" />
      </div>
      <div>
        <label>Min Amount</label>
        <input type="number" step="0.01" value={local.minAmount || ''} onChange={(e) => set('minAmount', e.target.value)} />
      </div>
      <div>
        <label>Max Amount</label>
        <input type="number" step="0.01" value={local.maxAmount || ''} onChange={(e) => set('maxAmount', e.target.value)} />
      </div>
      {showAdvanced && (
        <>
          <div>
            <label>Category</label>
            <input value={local.category || ''} onChange={(e) => set('category', e.target.value)} placeholder="e.g., Travel" />
          </div>
          <div>
            <label>Status</label>
            <select value={local.status || ''} onChange={(e) => set('status', e.target.value)}>
              <option value="">Any</option>
              <option>queued</option>
              <option>processing</option>
              <option>completed</option>
              <option>failed</option>
            </select>
          </div>
        </>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn" type="submit" style={{ background: 'var(--button-bg, #007bff)', color: 'var(--button-text, #fff)', border: 0, borderRadius: 8, padding: '10px 14px' }}>Search</button>
        <button type="button" className="btn" onClick={() => { const cleared = {}; setLocal(cleared); onChange && onChange(cleared); onSubmit && onSubmit(cleared); }}>Clear</button>
      </div>
    </form>
  );
}
