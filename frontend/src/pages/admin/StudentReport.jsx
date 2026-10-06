import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApi } from '../../api/endpoints';
import Loader from '../../components/Loader';

const PROFILE_FIELDS = [
  ['rollNo', 'Register No'], ['course', 'Course'], ['branch', 'Branch'], ['section', 'Section'],
  ['college', 'College'], ['batch', 'Batch'], ['email', 'Email'], ['phone', 'Phone'],
  ['gender', 'Gender'], ['dob', 'Date of Birth'], ['residentType', 'Resident'],
  ['fatherName', "Father's Name"], ['motherName', "Mother's Name"], ['address', 'Address'],
];

function initials(name = '') {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export default function StudentReport() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.studentReport(id).then(setData).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!data) return <Loader />;

  const { student: s, academics, summary } = data;

  return (
    <div className="stack" style={{ gap: 20 }}>
      <Link to="/admin/students" className="muted">← Back to students</Link>

      <div className="profile-head">
        <div className="big-avatar">{initials(s.name)}</div>
        <div>
          <h2 style={{ fontSize: '1.6rem' }}>{s.name}</h2>
          <p style={{ opacity: 0.9 }}>{s.branch} · Section {s.section}</p>
          <div className="meta">
            <div><span>Roll No</span><strong>{s.rollNo}</strong></div>
            <div><span>CGPA</span><strong>{summary.cgpa ?? '—'}</strong></div>
            <div><span>Backlogs</span><strong>{summary.totalBacklogs}</strong></div>
            <div><span>Active</span><strong>{summary.currentBacklogs}</strong></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Profile</h3></div>
        <div className="card-pad">
          <div className="info-grid">
            {PROFILE_FIELDS.map(([key, label]) => (
              <div className="kv" key={key}>
                <span>{label}</span>
                <strong style={{ textTransform: key === 'residentType' ? 'capitalize' : 'none' }}>{s[key] || '—'}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Semester-wise Performance</h3></div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr><th>Semester</th><th>Course</th><th>CGPA</th><th>Backlogs</th><th>Active</th></tr>
            </thead>
            <tbody>
              {academics.map((a) => (
                <tr key={a.semester}>
                  <td>Sem {a.semester}</td>
                  <td>{a.primaryCourse}</td>
                  <td>{a.cgpa ?? <span className="soft">Pending</span>}</td>
                  <td>{a.backlogs}</td>
                  <td>{a.currentBacklogs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
