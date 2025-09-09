export default function EmptyState({ title = "No data", description, action }) {
  return (
    <div style={{ padding: 24, textAlign: "center", color: "var(--text-primary,#1a1a1a)" }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>🗂️</div>
      <h3 style={{ margin: 0 }}>{title}</h3>
      {description && <p style={{ marginTop: 8 }}>{description}</p>}
      {action}
    </div>
  );
}
