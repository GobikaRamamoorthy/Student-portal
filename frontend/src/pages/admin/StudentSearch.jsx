import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/endpoints';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';

export default function StudentSearch() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [students, setStudents] = useState(null);

  const search = (query) => {
    setStudents(null);
    adminApi.searchStudents(query).then((d) => setStudents(d.students));
  };

  useEffect(() => {
    search('');
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    search(q);
  };

  return (
    <div className="stack" style={{ gap: 20 }}>
      <div>
        <h1 className="page-title">Students</h1>
        <p className="page-sub">Search by name, roll number or email, then open a full report.</p>
      </div>

      <form onSubmit={onSubmit} className="row" style={{ gap: 10 }}>
        <input
          className="input"
          placeholder="🔍  Search students…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">Search</button>
      </form>

      {!students ? (
        <Loader />
      ) : students.length === 0 ? (
        <EmptyState emoji="🔍" title="No students found" subtitle="Try a different search term." />
      ) : (
        <div className="card table-wrap">
          <table className="data">
            <thead>
              <tr><th>Roll No</th><th>Name</th><th>Branch</th><th>Section</th><th>Email</th><th></th></tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/students/${s.id}`)}>
                  <td>{s.rollNo}</td>
                  <td>{s.name}</td>
                  <td>{s.branch}</td>
                  <td>{s.section}</td>
                  <td className="muted">{s.email}</td>
                  <td><span className="btn btn-ghost btn-sm">View report →</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
