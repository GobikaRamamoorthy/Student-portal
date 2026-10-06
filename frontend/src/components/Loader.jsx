export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="loader">
      <div className="stack center" style={{ alignItems: 'center' }}>
        <div className="spinner" />
        <span className="muted" style={{ marginTop: 12 }}>{label}</span>
      </div>
    </div>
  );
}
