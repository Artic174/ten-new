const dbConnect = require('../../../lib/dbConnect');
const PrayerRecord = require('../../../models/PrayerRecord');
const mongoose = require('mongoose');
const { withAuth } = require('../../../lib/withAuth');

async function handler(req, res) {
  await dbConnect();
  const { month, studentId } = req.query;
  const match = {};
  if (month) {
    const [y, m] = month.split('-').map(Number);
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 1);
    match.date = { $gte: start, $lt: end };
  }
  if (studentId) match.student = mongoose.Types.ObjectId(studentId);

  const agg = [
    { $match: match },
    {
      $group: {
        _id: '$student',
        totalDaysRecorded: { $sum: 1 },
        totalDzuhur: { $sum: { $cond: ['$dzuhur', 1, 0] } },
        totalHaid: { $sum: { $cond: ['$haid', 1, 0] } }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'student'
      }
    },
    { $unwind: '$student' },
    {
      $project: {
        studentId: '$_id',
        name: '$student.name',
        username: '$student.username',
        totalDaysRecorded: 1,
        totalDzuhur: 1,
        totalHaid: 1
      }
    }
  ];

  const result = await PrayerRecord.aggregate(agg);
  return res.json({ result });
}

module.exports = withAuth(handler);