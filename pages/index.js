import { useEffect, useState } from 'react';
import Router from 'next/router';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [recordsCount, setRecordsCount] = useState(0);

  useEffect(() => {
    // try fetch current user by calling protected endpoint via stats (simple check)
    async function init() {
      const r = await fetch('/api/prayer-records?perPage=1');
      if (r.status === 401) return Router.push('/login');
      // we can fetch schedules publicly:
      const s = await fetch('/api/schedules');
      const ss = await s.json();
      setSchedules(ss);
      const stats = await fetch('/api/prayer-records/stats');
      if (stats.ok) {
        const d = await stats.json();
        setRecordsCount(d.result?.length || 0);
      }
    }
    init();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Schedules:</p>
      <ul>
        {schedules.map(s => <li key={s._id}>{new Date(s.date).toLocaleDateString()} - {s.title}</li>)}
      </ul>
      <p>Stat groups this month: {recordsCount}</p>
      <p>
        <a href="/kerohanian">Kerohanian</a> | <a href="/bendahara">Bendahara</a> | <a href="/login">Login</a>
      </p>
    </div>
  );
}