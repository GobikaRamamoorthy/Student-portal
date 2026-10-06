import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STUDENT_NAV = [
  { to: '/app', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/app/personal', label: 'Personal Info', icon: '👤' },
  { to: '/app/academics', label: 'Academics', icon: '📚' },
  { to: '/app/report', label: 'Full Report', icon: '📄' },
  { to: '/app/placements', label: 'Placement Drives', icon: '💼' },
  { to: '/app/requests', label: 'My Requests', icon: '✉️' },
];

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/admin/requests', label: 'Change Requests', icon: '✉️' },
  { to: '/admin/students', label: 'Students', icon: '🎓' },
];

function initials(name = '') {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export default function Layout({ variant }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const nav = variant === 'admin' ? ADMIN_NAV : STUDENT_NAV;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="shell">
      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <span className="logo-badge">🎓</span>
          Zen Stud
        </div>
        <div className="sidebar-role">{variant === 'admin' ? 'Admin Console' : 'Student Portal'}</div>
        <nav className="nav-section">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <span className="ico">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="btn btn-ghost btn-block" onClick={handleLogout} style={{ color: '#c7c9e0', borderColor: 'rgba(255,255,255,0.12)' }}>
            ⏻ Logout
          </button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setOpen((o) => !o)}>☰</button>
          <div style={{ flex: 1 }} />
          <div className="topbar-user">
            <div className="stack" style={{ textAlign: 'right', gap: 0 }}>
              <strong style={{ fontSize: '0.9rem' }}>{user?.name}</strong>
              <span className="soft" style={{ fontSize: '0.78rem' }}>{user?.email}</span>
            </div>
            <div className="avatar">{initials(user?.name)}</div>
          </div>
        </header>
        <main className="content fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
