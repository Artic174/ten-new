import { useEffect, useState } from 'react';

export default function Kerohanian() {
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [msg, setMsg] = useState('');

  useEffect(() => {
    async function load() {
      const r = await fetch('/api/users');
      if (r.status === 401) return window.location.href = '/login';
      // users list restricted to admin; for UI demo assume API allows read for kerohanian in production adjust endpoint accordingly
      const data = await r.json();
      setStudents(data);
    }
    load();
  }, []);

  async function mark(studentId, checked) {
    setMsg('');
    const res = await fetch('/api/prayer-records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student: studentId, date, dzuhur: checked })
    });
    if (!res.ok) {
      const d = await res.json();
      setMsg(d.message || 'Error');
    } else {
      setMsg('Saved');
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Kerohanian - Catatan Dzuhur</h1>
      <div>
        <label>Tanggal: <input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
      </div>
      <div style={{ marginTop: 12 }}>
        {students.map(u => (
          <div key={u._id} style={{ borderBottom: '1px solid #eee', padding: 8 }}>
            <strong>{u.name} ({u.username})</strong>
            <button style={{ marginLeft: 8 }} onClick={() => mark(u._id, true)}>Mark Dzuhur</button>
          </div>
        ))}
      </div>
      {msg && <p>{msg}</p>}
    </div>
  );
}