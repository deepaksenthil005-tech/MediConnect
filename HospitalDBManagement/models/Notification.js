const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true }, // INFO, SUCCESS, WARNING, ERROR
  target: { type: String, enum: ['ALL', 'PATIENTS', 'DOCTORS', 'ADMIN'], default: 'ALL' },
  category: { type: String, enum: ['SYSTEM', 'APPOINTMENT'], default: 'SYSTEM' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
