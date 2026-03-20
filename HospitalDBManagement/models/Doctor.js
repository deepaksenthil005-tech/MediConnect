const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  experience: { type: String, required: true },
  qualification: { type: String, required: true },
  specialization: { type: String, required: true },
  availability: { type: String, required: true },
  bio: { type: String, required: true },
  fee: { type: Number, required: true },
  status: { type: String, default: 'Available' },
  imageUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Doctor', doctorSchema);
