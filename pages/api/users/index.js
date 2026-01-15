const dbConnect = require('../../../lib/dbConnect');
const User = require('../../../models/User');
const bcrypt = require('bcryptjs');
const { withAuth, requireRole } = require('../../../lib/withAuth');

async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    // list users (admin only)
    const users = await User.find().select('-passwordHash').sort({ className: 1, absen: 1 });
    return res.json(users);
  }

  if (req.method === 'POST') {
    // create user (admin only)
    const { username, password, name, role = 'student', className, absen } = req.body;
    if (!username || !password || !name) return res.status(400).json({ message: 'Missing fields' });
    const passwordHash = await bcrypt.hash(password, 10);
    const u = await User.create({ username, passwordHash, name, role, className, absen });
    return res.status(201).json({ _id: u._id, username: u.username, name: u.name, role: u.role });
  }

  if (req.method === 'PUT') {
    // update user (admin or user themself)
    const { id, name, role, className, absen, password } = req.body;
    if (!id) return res.status(400).json({ message: 'Missing id' });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Not found' });

    // only admin or owner
    if (req.user.role !== 'admin' && req.user.sub !== id) return res.status(403).json({ message: 'Forbidden' });

    if (name) user.name = name;
    if (role && req.user.role === 'admin') user.role = role;
    if (className) user.className = className;
    if (absen !== undefined) user.absen = absen;
    if (password) user.passwordHash = await bcrypt.hash(password, 10);

    await user.save();
    return res.json({ ok: true });
  }

  if (req.method === 'DELETE') {
    // delete user (admin only)
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: 'Missing id' });
    await User.findByIdAndDelete(id);
    return res.json({ ok: true });
  }

  return res.status(405).end();
}

module.exports = requireRole(['admin'])(withAuth(handler));