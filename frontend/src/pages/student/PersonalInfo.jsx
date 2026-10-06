import { useEffect, useState } from 'react';
import { studentApi } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';

const READONLY = [
  ['rollNo', 'Roll Number'],
  ['email', 'Email'],
  ['course', 'Course'],
  ['branch', 'Branch'],
  ['batch', 'Batch'],
  ['college', 'College'],
];

const EDITABLE = [
  ['name', 'Full Name', 'text'],
  ['phone', 'Phone', 'tel'],
  ['altEmail', 'Alternate Email', 'email'],
  ['gender', 'Gender', 'text'],
  ['dob', 'Date of Birth', 'date'],
  ['fatherName', "Father's Name", 'text'],
  ['motherName', "Mother's Name", 'text'],
  ['address', 'Address', 'text'],
];

export default function PersonalInfo() {
  const { refreshStudent } = useAuth();
  const [form, setForm] = useState(null);
  const [original, setOriginal] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    studentApi.profile().then((d) => {
      setForm(d.student);
      setOriginal(d.student);
    });
  }, []);

  if (!form) return <Loader />;

  const change = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const cancel = () => {
    setForm(original);
    setEditing(false);
    setMsg(null);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const patch = {};
      EDITABLE.forEach(([k]) => { patch[k] = form[k] ?? ''; });
      patch.residentType = form.residentType;
      const { student } = await studentApi.updateProfile(patch);
      setForm(student);
      setOriginal(student);
      refreshStudent(student);
      setEditing(false);
      setMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="stack" style={{ gap: 20 }}>
      <div className="row between">
        <div>
          <h1 className="page-title">Personal Information</h1>
          <p className="page-sub">Keep your contact and personal details up to date.</p>
        </div>
        {!editing ? (
          <button type="button" className="btn btn-primary" onClick={() => setEditing(true)}>✏️ Edit</button>
        ) : (
          <div className="row">
            <button type="button" className="btn btn-ghost" onClick={cancel}>Discard</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        )}
      </div>

      {msg && <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`}>{msg.text}</div>}

      <div className="card card-pad">
        <h3>Account details</h3>
        <p className="page-sub" style={{ marginBottom: 18 }}>Managed by the institute and cannot be edited here.</p>
        <div className="info-grid">
          {READONLY.map(([key, label]) => (
            <div className="field" key={key} style={{ margin: 0 }}>
              <label>{label}</label>
              <input className="input" value={form[key] ?? ''} disabled />
            </div>
          ))}
        </div>
      </div>

      <div className="card card-pad">
        <h3>Editable details</h3>
        <p className="page-sub" style={{ marginBottom: 18 }}>Update these and save your changes.</p>
        <div className="info-grid">
          {EDITABLE.map(([key, label, type]) => (
            <div className="field" key={key} style={{ margin: 0 }}>
              <label>{label}</label>
              <input
                className="input"
                type={type}
                value={form[key] ?? ''}
                onChange={change(key)}
                disabled={!editing}
              />
            </div>
          ))}
          <div className="field" style={{ margin: 0 }}>
            <label>Resident Type</label>
            <select className="select" value={form.residentType ?? ''} onChange={change('residentType')} disabled={!editing}>
              <option value="hosteller">Hosteller</option>
              <option value="day-scholar">Day Scholar</option>
            </select>
          </div>
        </div>
      </div>
    </form>
  );
}
