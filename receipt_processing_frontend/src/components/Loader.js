export default function Loader({ text = "Loading..." }) {
  return (
    <div style={{display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", gap:"10px"}}>
      <div className="spinner" aria-hidden="true" />
      <span>{text}</span>
      <style>{`
        .spinner {
          width: 18px;
          height: 18px;
          border: 3px solid var(--border-color, #e9ecef);
          border-top-color: var(--button-bg, #007bff);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
