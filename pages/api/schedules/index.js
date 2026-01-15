const dbConnect = require('../../../lib/dbConnect');
const Schedule = require('../../../models/Schedule');
const { withAuth, requireRole } = require('../../../lib/withAuth');

async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const items = await Schedule.find().sort({ date: 1 });
    return res.json(items);
  }

  if (req.method === 'POST') {
    const { title, description, date, startTime, endTime } = req.body;
    if (!title || !date) return res.status(400).json({ message: 'Missing fields' });
    const s = await Schedule.create({
      title, description, date, startTime, endTime, createdBy: req.user.sub
    });
    return res.status(201).json(s);
  }

  if (req.method === 'PUT') {
    const { id, ...updates } = req.body;
    if (!id) return res.status(400).json({ message: 'Missing id' });
    const s = await Schedule.findByIdAndUpdate(id, updates, { new: true });
    return res.json(s);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: 'Missing id' });
    await Schedule.findByIdAndDelete(id);
    return res.json({ ok: true });
  }

  return res.status(405).end();
}

module.exports = requireRole(['bendahara','admin'])(withAuth(handler));