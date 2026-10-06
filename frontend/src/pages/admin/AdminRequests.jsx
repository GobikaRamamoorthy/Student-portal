import { useEffect, useState, useCallback } from 'react';
import { requestApi } from '../../api/endpoints';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';

const FILTERS = ['pending', 'accepted', 'rejected', 'all'];

const FIELD_LABELS = {
  cgpa: 'CGPA', backlogs: 'Total Backlogs', currentBacklogs: 'Active Backlogs',
  clearanceDate: 'Clearance Date', marksheetUrl: 'Marksheet',
};

export default function AdminRequests() {
  const [filter, setFilter] = useState('pending');
  const [requests, setRequests] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(() => {
    setRequests(null);
    const params = filter === 'all' ? {} : { status: filter };
    requestApi.list(params).then((d) => setRequests(d.requests));
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const resolve = async (id, action) => {
    setBusyId(id);
    try {
      await requestApi.resolve(id, action);
      load();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="stack" style={{ gap: 20 }}>
      <div>
        <h1 className="page-title">Change Requests</h1>
        <p className="page-sub">Review and resolve academic change requests from students.</p>
      </div>

      <div className="sem-tabs">
        {FILTERS.map((f) => (
          <button key={f} className={`sem-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {!requests ? (
        <Loader />
      ) : requests.length === 0 ? (
        <EmptyState emoji="✅" title="Nothing here" subtitle={`No ${filter === 'all' ? '' : filter} requests to show.`} />
      ) : (
        <div className="card table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Roll No</th><th>Name</th><th>Branch</th><th>Sem</th>
                <th>Field</th><th>Current → Requested</th><th>Reason</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.rollNo}</td>
                  <td>{r.studentName}</td>
                  <td>{r.branch}</td>
                  <td>{r.semester}</td>
                  <td>{FIELD_LABELS[r.field] || r.field}</td>
                  <td>
                    <span className="soft">{String(r.currentValue ?? '—')}</span>
                    {' → '}
                    <strong>{String(r.requestedValue)}</strong>
                  </td>
                  <td className="muted" style={{ maxWidth: 200 }}>{r.reason || '—'}</td>
                  <td>
                    {r.status === 'pending' ? (
                      <div className="row" style={{ gap: 8 }}>
                        <button className="btn btn-success btn-sm" disabled={busyId === r.id} onClick={() => resolve(r.id, 'accept')}>✓ Accept</button>
                        <button className="btn btn-danger btn-sm" disabled={busyId === r.id} onClick={() => resolve(r.id, 'reject')}>✕ Reject</button>
                      </div>
                    ) : (
                      <span className={`badge badge-${r.status}`}>{r.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
