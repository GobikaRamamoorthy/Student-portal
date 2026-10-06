import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentApi, requestApi } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';

function initials(name = '') {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

const QUICK_LINKS = [
  { to: '/app/personal', icon: '👤', title: 'Personal Info', sub: 'View & edit your details' },
  { to: '/app/academics', icon: '📚', title: 'Academics', sub: 'Semester records & marksheets' },
  { to: '/app/report', icon: '📄', title: 'Full Report', sub: 'Consolidated profile' },
  { to: '/app/placements', icon: '💼', title: 'Placements', sub: 'Upcoming drives' },
];

export default function Dashboard() {
  const { student } = useAuth();
  const [data, setData] = useState(null);
  const [pending, setPending] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([studentApi.report(), requestApi.list()])
      .then(([report, reqs]) => {
        setData(report);
        setPending(reqs.requests.filter((r) => r.status === 'pending').length);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const s = data?.student || student || {};
  const summary = data?.summary || {};

  const stats = [
    { label: 'CGPA', value: summary.cgpa ?? '—', icon: '⭐', bg: '#fef9c3', fg: '#a16207' },
    { label: 'Current Semester', value: s.currentSemester ?? '—', icon: '📅', bg: 'var(--brand-50)', fg: 'var(--brand-600)' },
    { label: 'Active Backlogs', value: summary.currentBacklogs ?? 0, icon: '⚠️', bg: '#fee2e2', fg: '#b91c1c' },
    { label: 'Pending Requests', value: pending, icon: '✉️', bg: '#dcfce7', fg: '#15803d' },
  ];

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div className="profile-head">
        <div className="big-avatar">{initials(s.name)}</div>
        <div>
          <h2 style={{ fontSize: '1.6rem' }}>{s.name}</h2>
          <p style={{ opacity: 0.9 }}>{s.branch} · {s.course}</p>
          <div className="meta">
            <div><span>Roll No</span><strong>{s.rollNo}</strong></div>
            <div><span>Batch</span><strong>{s.batch}</strong></div>
            <div><span>College</span><strong>{s.college}</strong></div>
            <div><span>Resident</span><strong style={{ textTransform: 'capitalize' }}>{s.residentType}</strong></div>
          </div>
        </div>
      </div>

      <div className="stat-grid">
        {stats.map((st) => (
          <div className="stat" key={st.label}>
            <div className="stat-ico" style={{ background: st.bg, color: st.fg }}>{st.icon}</div>
            <div className="stat-label">{st.label}</div>
            <div className="stat-value">{st.value}</div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mt-0">Quick actions</h3>
        <p className="page-sub" style={{ marginBottom: 16 }}>Jump straight to what you need.</p>
        <div className="quick-links">
          {QUICK_LINKS.map((q) => (
            <Link to={q.to} className="quick-link" key={q.to}>
              <span className="ql-ico">{q.icon}</span>
              <span className="ql-title">{q.title}</span>
              <span className="ql-sub">{q.sub}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
