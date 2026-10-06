import { useEffect, useState } from 'react';
import { studentApi } from '../../api/endpoints';
import Loader from '../../components/Loader';

const PROFILE_FIELDS = [
  ['name', 'Name'], ['rollNo', 'Register No'], ['course', 'Course'], ['branch', 'Branch'],
  ['college', 'College'], ['batch', 'Batch'], ['email', 'Email'], ['phone', 'Phone'],
  ['gender', 'Gender'], ['dob', 'Date of Birth'], ['residentType', 'Resident'],
  ['fatherName', "Father's Name"], ['motherName', "Mother's Name"], ['address', 'Address'],
  ['currentSemester', 'Current Semester'], ['currentYear', 'Current Year'],
];

export default function Report() {
  const [data, setData] = useState(null);

  useEffect(() => {
    studentApi.report().then(setData);
  }, []);

  if (!data) return <Loader />;
  const { student: s, academics, summary } = data;

  return (
    <div className="stack" style={{ gap: 20 }}>
      <div className="row between">
        <div>
          <h1 className="page-title">Full Report</h1>
          <p className="page-sub">A consolidated view of your profile and performance.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => window.print()}>🖨️ Print</button>
      </div>

      <div className="stat-grid">
        <div className="stat"><div className="stat-label">Overall CGPA</div><div className="stat-value">{summary.cgpa ?? '—'}</div></div>
        <div className="stat"><div className="stat-label">Semesters Completed</div><div className="stat-value">{summary.semestersCompleted}</div></div>
        <div className="stat"><div className="stat-label">Total Backlogs</div><div className="stat-value">{summary.totalBacklogs}</div></div>
        <div className="stat"><div className="stat-label">Active Backlogs</div><div className="stat-value">{summary.currentBacklogs}</div></div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Profile</h3></div>
        <div className="card-pad">
          <div className="info-grid">
            {PROFILE_FIELDS.map(([key, label]) => (
              <div className="kv" key={key}>
                <span>{label}</span>
                <strong style={{ textTransform: key === 'residentType' ? 'capitalize' : 'none' }}>
                  {s[key] || '—'}
                </strong>
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
              <tr>
                <th>Semester</th><th>Course</th><th>CGPA</th>
                <th>Backlogs</th><th>Active</th><th>Marksheet</th>
              </tr>
            </thead>
            <tbody>
              {academics.map((a) => (
                <tr key={a.semester}>
                  <td>Sem {a.semester}</td>
                  <td>{a.primaryCourse}</td>
                  <td>{a.cgpa ?? <span className="soft">Pending</span>}</td>
                  <td>{a.backlogs}</td>
                  <td>{a.currentBacklogs}</td>
                  <td>{a.marksheetUrl ? <a href={a.marksheetUrl} onClick={(e) => e.preventDefault()}>📎 PDF</a> : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
