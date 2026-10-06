import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { requestApi } from '../../api/endpoints';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';

const FIELD_LABELS = {
  cgpa: 'CGPA',
  backlogs: 'Total Backlogs',
  currentBacklogs: 'Active Backlogs',
  clearanceDate: 'Clearance Date',
  marksheetUrl: 'Marksheet',
};

export default function MyRequests() {
  const [requests, setRequests] = useState(null);

  useEffect(() => {
    requestApi.list().then((d) => setRequests(d.requests));
  }, []);

  if (!requests) return <Loader />;

  return (
    <div className="stack" style={{ gap: 20 }}>
      <div>
        <h1 className="page-title">My Requests</h1>
        <p className="page-sub">Track the status of academic change requests you’ve submitted.</p>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          emoji="✉️"
          title="No requests yet"
          subtitle="Submit a change request from the Academics page."
        >
          <Link to="/app/academics" className="btn btn-primary">Go to Academics</Link>
        </EmptyState>
      ) : (
        <div className="card table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Submitted</th><th>Semester</th><th>Field</th>
                <th>Current</th><th>Requested</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td>Sem {r.semester}</td>
                  <td>{FIELD_LABELS[r.field] || r.field}</td>
                  <td>{String(r.currentValue ?? '—')}</td>
                  <td><strong>{String(r.requestedValue)}</strong></td>
                  <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
