import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 20 }}>
      <div>
        <div style={{ fontSize: '4rem' }}>🛰️</div>
        <h1 style={{ fontSize: '2.4rem' }}>404</h1>
        <p className="muted mt-1">The page you’re looking for drifted off into space.</p>
        <Link to="/login" className="btn btn-primary mt-3">Back to login</Link>
      </div>
    </div>
  );
}
