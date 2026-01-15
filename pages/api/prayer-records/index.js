const dbConnect = require('../../../lib/dbConnect');
const PrayerRecord = require('../../../models/PrayerRecord');
const User = require('../../../models/User');
const { withAuth, requireRole } = require('../../../lib/withAuth');
const mongoose = require('mongoose');

async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    // params: studentId, month (YYYY-MM), page, perPage
    const { studentId, month, page = 1, perPage = 50 } = req.query;
    const filter = {};
    if (studentId) filter.student = mongoose.Types.ObjectId(studentId);
    if (month) {
      const [y, m] = month.split('-').map(Number);
      if (y && m) {
        const start = new Date(y, m - 1, 1);
        const end = new Date(y, m, 1);
        filter.date = { $gte: start, $lt: end };
      }
    }
    const items = await PrayerRecord.find(filter).populate('student', 'name username className absen').sort({ date: -1 }).limit(Number(perPage)).skip((page - 1) * perPage);
    const total = await PrayerRecord.countDocuments(filter);
    return res.json({ items, total });
  }

  if (req.method === 'POST') {
    // only kerohanian can create
    const { student, date, dzuhur = false, note = '', haid = false } = req.body;
    if (!student || !date) return res.status(400).json({ message: 'Missing fields' });

    // ensure unique per student/date
    const d = new Date(date);
    const existing = await PrayerRecord.findOne({ student, date: d });
    if (existing) return res.status(409).json({ message: 'Record exists' });

    const rec = await PrayerRecord.create({
      student, date: d, dzuhur, note, haid, recordedBy: req.user.sub
    });
    return res.status(201).json(rec);
  }

  if (req.method === 'PUT') {
    const { id, dzuhur, note, haid } = req.body;
    if (!id) return res.status(400).json({ message: 'Missing id' });
    const rec = await PrayerRecord.findById(id);
    if (!rec) return res.status(404).json({ message: 'Not found' });
    rec.dzuhur = dzuhur !== undefined ? dzuhur : rec.dzuhur;
    rec.note = note !== undefined ? note : rec.note;
    rec.haid = haid !== undefined ? haid : rec.haid;
    rec.updatedBy = req.user.sub;
    rec.updatedAt = new Date();
    await rec.save();
    return res.json(rec);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: 'Missing id' });
    await PrayerRecord.findByIdAndDelete(id);
    return res.json({ ok: true });
  }

  return res.status(405).end();
}

module.exports = requireRole(['kerohanian','admin'])(withAuth(handler));