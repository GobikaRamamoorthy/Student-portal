import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, requestApi } from '../../api/endpoints';
import Loader from '../../components/Loader';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    Promise.all([adminApi.stats(), requestApi.list({ status: 'pending' })]).then(
      ([s, r]) => {
        setStats(s.stats);
        setRecent(r.requests.slice(0, 5));
      }
    );
  }, []);

  if (!stats) return <Loader />;

  const cards = [
    { label: 'Total Students', value: stats.totalStudents, icon: '🎓', bg: 'var(--brand-50)', fg: 'var(--brand-600)' },
    { label: 'Pending Requests', value: stats.pendingRequests, icon: '⏳', bg: '#fef3c7', fg: '#b45309' },
    { label: 'Accepted', value: stats.acceptedRequests, icon: '✅', bg: '#dcfce7', fg: '#15803d' },
    { label: 'Rejected', value: stats.rejectedRequests, icon: '❌', bg: '#fee2e2', fg: '#b91c1c' },
  ];

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div>
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-sub">Overview of student records and pending change requests.</p>
      </div>

      <div className="stat-grid">
        {cards.map((c) => (
          <div className="stat" key={c.label}>
            <div className="stat-ico" style={{ background: c.bg, color: c.fg }}>{c.icon}</div>
            <div className="stat-label">{c.label}</div>
            <div className="stat-value">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Latest pending requests</h3>
          <Link to="/admin/requests" className="btn btn-ghost btn-sm">View all →</Link>
        </div>
        <div className="table-wrap">
          {recent.length === 0 ? (
            <p className="empty">🎉 No pending requests — you’re all caught up!</p>
          ) : (
            <table className="data">
              <thead>
                <tr><th>Roll No</th><th>Name</th><th>Branch</th><th>Field</th><th>Requested</th></tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id}>
                    <td>{r.rollNo}</td>
                    <td>{r.studentName}</td>
                    <td>{r.branch}</td>
                    <td>{r.field}</td>
                    <td><strong>{String(r.requestedValue)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
