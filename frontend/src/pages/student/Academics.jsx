import { useEffect, useMemo, useState } from 'react';
import { studentApi, requestApi } from '../../api/endpoints';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import EmptyState from '../../components/EmptyState';

const REQUESTABLE = [
  { field: 'cgpa', label: 'CGPA' },
  { field: 'backlogs', label: 'Total Backlogs' },
  { field: 'currentBacklogs', label: 'Active Backlogs' },
  { field: 'clearanceDate', label: 'Backlog Clearance Date' },
];

export default function Academics() {
  const [academics, setAcademics] = useState([]);
  const [active, setActive] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);

  const load = () => studentApi.academics().then((d) => setAcademics(d.academics));

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const record = useMemo(() => academics.find((a) => a.semester === active), [academics, active]);

  if (loading) return <Loader />;

  const released = record && record.cgpa !== null;

  return (
    <div className="stack" style={{ gap: 20 }}>
      <div>
        <h1 className="page-title">Academic Records</h1>
        <p className="page-sub">Select a semester to view results, backlogs and marksheets.</p>
      </div>

      <div className="sem-tabs">
        {academics.map((a) => (
          <button
            key={a.semester}
            className={`sem-pill ${active === a.semester ? 'active' : ''} ${a.cgpa === null ? 'locked' : ''}`}
            onClick={() => setActive(a.semester)}
          >
            Sem {a.semester}{a.cgpa === null ? ' 🔒' : ''}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h3>Semester {active}</h3>
            <span className="muted" style={{ fontSize: '0.85rem' }}>{record?.primaryCourse}</span>
          </div>
          {released && (
            <button className="btn btn-ghost btn-sm" onClick={() => setModal(true)}>
              ✉️ Request a change
            </button>
          )}
        </div>

        <div className="card-pad">
          {!released ? (
            <EmptyState emoji="⏳" title="Results not released yet" subtitle="This semester's results will appear here once published by the institute." />
          ) : (
            <div className="info-grid">
              <div className="kv"><span>CGPA</span><strong>{record.cgpa}</strong></div>
              <div className="kv"><span>Total Backlogs</span><strong>{record.backlogs}</strong></div>
              <div className="kv"><span>Active Backlogs</span><strong>{record.currentBacklogs}</strong></div>
              <div className="kv"><span>Clearance Date</span><strong>{record.clearanceDate || '—'}</strong></div>
              <div className="kv">
                <span>Marksheet</span>
                {record.marksheetUrl
                  ? <a href={record.marksheetUrl} onClick={(e) => e.preventDefault()}>📎 Download PDF</a>
                  : <strong>—</strong>}
              </div>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <RequestModal semester={active} record={record} onClose={() => setModal(false)} onDone={load} />
      )}
    </div>
  );
}

function RequestModal({ semester, record, onClose, onDone }) {
  const [field, setField] = useState('cgpa');
  const [requestedValue, setRequestedValue] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const numeric = field !== 'clearanceDate';

  const submit = async () => {
    setError('');
    setSubmitting(true);
    try {
      const value = numeric ? Number(requestedValue) : requestedValue;
      await requestApi.create({ semester, field, requestedValue: value, reason });
      setDone(true);
      await onDone();
    } catch (err) {
      setError(err.details?.[0]?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={`Request a change · Semester ${semester}`}
      onClose={onClose}
      footer={!done && (
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={submitting || requestedValue === ''}>
            {submitting ? 'Submitting…' : 'Submit request'}
          </button>
        </>
      )}
    >
      {done ? (
        <div className="alert alert-success" style={{ margin: 0 }}>
          ✅ Your request has been submitted and is awaiting admin review.
        </div>
      ) : (
        <>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="field">
            <label>Field to change</label>
            <select className="select" value={field} onChange={(e) => { setField(e.target.value); setRequestedValue(''); }}>
              {REQUESTABLE.map((r) => <option key={r.field} value={r.field}>{r.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Current value</label>
            <input className="input" value={record?.[field] ?? '—'} disabled />
          </div>
          <div className="field">
            <label>Requested value</label>
            <input
              className="input"
              type={numeric ? 'number' : 'date'}
              step="0.01"
              value={requestedValue}
              onChange={(e) => setRequestedValue(e.target.value)}
            />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label>Reason (optional)</label>
            <textarea className="input" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Explain why this change is needed…" />
          </div>
        </>
      )}
    </Modal>
  );
}
