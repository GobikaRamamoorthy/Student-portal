import { useEffect, useState } from 'react';
import { placementApi } from '../../api/endpoints';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';

export default function Placements() {
  const [placements, setPlacements] = useState(null);

  useEffect(() => {
    placementApi.list().then((d) => setPlacements(d.placements));
  }, []);

  if (!placements) return <Loader />;

  return (
    <div className="stack" style={{ gap: 20 }}>
      <div>
        <h1 className="page-title">Placement Drives</h1>
        <p className="page-sub">Upcoming and past campus recruitment drives.</p>
      </div>

      {placements.length === 0 ? (
        <EmptyState emoji="💼" title="No drives scheduled" subtitle="Check back soon for upcoming opportunities." />
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {placements.map((p) => (
            <div className="card card-pad" key={p.id}>
              <div className="row between center">
                <h3>{p.company}</h3>
                <span className={`badge badge-${p.status}`}>{p.status}</span>
              </div>
              <p className="muted" style={{ marginTop: 4 }}>{p.role}</p>
              <div className="info-grid mt-3" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="kv"><span>Package</span><strong>{p.package}</strong></div>
                <div className="kv"><span>Location</span><strong>{p.location}</strong></div>
                <div className="kv"><span>Drive Date</span><strong>{p.driveDate}</strong></div>
              </div>
              <div className="mt-2" style={{ padding: 12, background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
                <span className="soft" style={{ fontSize: '0.75rem', fontWeight: 600 }}>ELIGIBILITY</span>
                <p style={{ fontSize: '0.9rem', marginTop: 4 }}>{p.eligibility}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
