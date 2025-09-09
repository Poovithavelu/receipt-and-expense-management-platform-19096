export default function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / (pageSize || 20)));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "flex-end" }}>
      <span style={{ opacity: 0.7 }}>Page {page} of {totalPages}</span>
      <button disabled={!canPrev} onClick={() => canPrev && onPageChange(page - 1)} className="theme-toggle" style={{ padding: "6px 10px" }}>
        Prev
      </button>
      <button disabled={!canNext} onClick={() => canNext && onPageChange(page + 1)} className="theme-toggle" style={{ padding: "6px 10px" }}>
        Next
      </button>
    </div>
  );
}
