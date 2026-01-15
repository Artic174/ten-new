const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // format 10-<absen>
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['student','bendahara','kerohanian','admin'], default: 'student' },
  className: { type: String },
  absen: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);