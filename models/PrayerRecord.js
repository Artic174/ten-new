const mongoose = require('mongoose');

const PrayerRecordSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  dzuhur: { type: Boolean, default: false },
  note: { type: String },
  haid: { type: Boolean, default: false },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

PrayerRecordSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.models.PrayerRecord || mongoose.model('PrayerRecord', PrayerRecordSchema);