import { useEffect, useState } from 'react';

export default function Bendahara() {
  const [schedules, setSchedules] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));

  async function load() {
    const r = await fetch('/api/schedules');
    const data = await r.json();
    setSchedules(data);
  }

  useEffect(() => { load(); }, []);

  async function create() {
    await fetch('/api/schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, date })
    });
    setTitle('');
    load();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Bendahara - Jadwal</h1>
      <div>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <button onClick={create}>Create</button>
      </div>
      <ul>
        {schedules.map(s => <li key={s._id}>{new Date(s.date).toLocaleDateString()} - {s.title}</li>)}
      </ul>
    </div>
  );
}