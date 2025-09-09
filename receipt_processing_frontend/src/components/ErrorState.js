export default function ErrorState({ title = "Something went wrong", description, onRetry }) {
  return (
    <div style={{ padding: "24px", border: "1px solid var(--border-color,#e9ecef)", borderRadius: 8, background: "var(--bg-primary,#fff)" }}>
      <h3 style={{ marginTop: 0, color: "crimson" }}>⚠️ {title}</h3>
      {description && <p style={{ margin: "8px 0 16px 0" }}>{description}</p>}
      {onRetry && <button onClick={onRetry} className="theme-toggle">Retry</button>}
    </div>
  );
}
