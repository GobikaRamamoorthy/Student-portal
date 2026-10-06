import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEMO = {
  student: { email: 'aisha@zenstud.edu', password: 'Student@1' },
  admin: { email: 'admin@zenstud.edu', password: 'Admin@123' },
};

export default function Login() {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/app'} replace />;
  }

  const switchRole = (r) => {
    setRole(r);
    setError('');
  };

  const fillDemo = () => {
    setEmail(DEMO[role].email);
    setPassword(DEMO[role].password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const loggedIn = await login(email.trim(), password);
      navigate(loggedIn.role === 'admin' ? '/admin' : '/app', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrap">
      <section className="auth-hero">
        <div className="sidebar-brand" style={{ padding: 0, color: '#fff' }}>
          <span className="logo-badge">🎓</span> Zen Stud
        </div>
        <div>
          <h1>Your campus,<br />beautifully organised.</h1>
          <p className="tag">
            Track academics, manage your profile, explore placement drives and
            raise change requests — all in one modern portal.
          </p>
          <div className="hero-points">
            <div className="hero-point"><span className="dot">📚</span> Semester-wise academic records & marksheets</div>
            <div className="hero-point"><span className="dot">💼</span> Live placement drive listings</div>
            <div className="hero-point"><span className="dot">✅</span> Admin-reviewed change requests</div>
          </div>
        </div>
        <p style={{ opacity: 0.6, fontSize: '0.85rem' }}>© {new Date().getFullYear()} Zen Institute of Technology</p>
      </section>

      <section className="auth-panel">
        <div className="auth-card card card-pad">
          <h2 style={{ fontSize: '1.5rem' }}>Welcome back</h2>
          <p className="page-sub" style={{ marginBottom: 20 }}>Sign in to continue to your portal.</p>

          <div className="role-tabs">
            <button className={`role-tab ${role === 'student' ? 'active' : ''}`} onClick={() => switchRole('student')}>
              🎓 Student
            </button>
            <button className={`role-tab ${role === 'admin' ? 'active' : ''}`} onClick={() => switchRole('admin')}>
              🛡️ Admin
            </button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="input"
                type="email"
                value={email}
                placeholder="you@zenstud.edu"
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                className="input"
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="demo-hint">
            Demo {role} account —{' '}
            <a href="#fill" onClick={(e) => { e.preventDefault(); fillDemo(); }}>autofill credentials</a>
            <br />
            {DEMO[role].email} · {DEMO[role].password}
          </p>
        </div>
      </section>
    </div>
  );
}
