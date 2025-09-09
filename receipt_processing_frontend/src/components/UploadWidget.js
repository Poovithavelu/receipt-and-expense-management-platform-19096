import React, { useRef } from 'react';
import { useDocumentActions } from '../context/DocumentContext';
import Api from '../services/api';

// PUBLIC_INTERFACE
export default function UploadWidget({ onUploaded }) {
  /** File upload widget; posts file to backend and updates global queue. */
  const inputRef = useRef(null);
  const { enqueueUpload, updateUpload, removeUpload } = useDocumentActions();

  const handleFiles = async (files) => {
    const list = Array.from(files || []);
    for (const file of list) {
      const tempId = `${file.name}-${file.size}-${Date.now()}`;
      enqueueUpload({ file, tempId, status: 'queued', progress: 0, error: null });

      // Simulate progress locally while uploading; backend may not provide chunk progress.
      const tick = setInterval(() => {
        updateUpload(tempId, (prev => prev)); // no-op to keep state fresh
      }, 300);

      try {
        updateUpload(tempId, { status: 'uploading', progress: 10 });
        const formData = new FormData();
        formData.append('file', file);
        const res = await Api.uploadDocument(formData);
        clearInterval(tick);
        updateUpload(tempId, { status: 'uploaded', progress: 100, backendId: res?.id || res?.documentId });
        onUploaded && onUploaded(res);
        // Remove from queue after brief delay
        setTimeout(() => removeUpload(tempId), 800);
      } catch (e) {
        clearInterval(tick);
        updateUpload(tempId, { status: 'error', error: e.message, progress: 0 });
      }
    }
  };

  const onChange = (e) => handleFiles(e.target.files);

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onDrop={onDrop}
      className="upload-widget"
      style={{
        border: '2px dashed var(--border-color, #e9ecef)',
        padding: 24,
        borderRadius: 12,
        textAlign: 'center',
        background: 'var(--bg-primary, #fff)',
      }}
    >
      <p style={{ marginBottom: 12 }}>Drag & drop receipts or invoices here, or</p>
      <button
        className="btn"
        onClick={() => inputRef.current?.click()}
        style={{
          background: 'var(--button-bg, #007bff)',
          color: 'var(--button-text, #fff)',
          padding: '10px 16px',
          borderRadius: 8,
          border: 0,
          cursor: 'pointer',
        }}
      >
        Choose Files
      </button>
      <input ref={inputRef} type="file" multiple onChange={onChange} style={{ display: 'none' }} />
      <small style={{ display: 'block', marginTop: 8, color: 'gray' }}>Supported: PDF, PNG, JPG</small>
    </div>
  );
}
