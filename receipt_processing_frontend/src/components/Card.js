export default function Card({ header, children, footer }) {
  return (
    <div style={{
      border: "1px solid var(--border-color,#e9ecef)",
      borderRadius: 10,
      padding: 16,
      background: "var(--bg-primary,#fff)",
      boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
    }}>
      {header && <div style={{ marginBottom: 10, fontWeight: 600 }}>{header}</div>}
      <div>{children}</div>
      {footer && <div style={{ marginTop: 12 }}>{footer}</div>}
    </div>
  );
}
