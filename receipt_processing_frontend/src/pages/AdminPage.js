import React, { useEffect, useState } from 'react';
import Api from '../services/api';

// PUBLIC_INTERFACE
export default function AdminPage() {
  /** Admin dashboard for monitoring and statistics. */
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [s, a, h] = await Promise.all([
        Api.getAdminStats().catch(() => null),
        Api.getAdminActivity().catch(() => []),
        Api.getSystemHealth().catch(() => null),
      ]);
      setStats(s);
      setActivity(Array.isArray(a) ? a : (a?.items || []));
      setHealth(h);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="container">
      <h2>Admin</h2>
      {loading ? <p>Loading admin data...</p> : (
        <div style={{ display: 'grid', gap: 16 }}>
          <section style={{ border: '1px solid var(--border-color, #e9ecef)', borderRadius: 8, padding: 12 }}>
            <h3>Statistics</h3>
            {!stats ? <p>No stats available.</p> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12 }}>
                {Object.entries(stats).map(([k, v]) => (
                  <div key={k} style={{ border: '1px solid var(--border-color, #e9ecef)', borderRadius: 8, padding: 12 }}>
                    <div style={{ opacity: 0.7 }}>{k}</div>
                    <div style={{ fontSize: 24, fontWeight: 700 }}>{v}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section style={{ border: '1px solid var(--border-color, #e9ecef)', borderRadius: 8, padding: 12 }}>
            <h3>Recent Activity</h3>
            {activity.length === 0 ? <p>No recent activity.</p> : (
              <ul style={{ paddingLeft: 18 }}>
                {activity.map((a, idx) => (
                  <li key={idx}>
                    <strong>{a.type || a.event}</strong> · {a.message || a.detail || '-'} · <small>{a.time ? new Date(a.time).toLocaleString() : '-'}</small>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section style={{ border: '1px solid var(--border-color, #e9ecef)', borderRadius: 8, padding: 12 }}>
            <h3>System Health</h3>
            {!health ? <p>No health data.</p> : (
              <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
{JSON.stringify(health, null, 2)}
              </pre>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
