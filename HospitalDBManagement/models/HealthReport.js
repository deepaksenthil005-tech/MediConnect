const mongoose = require('mongoose');

const healthReportSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  weight: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  heartRate: { type: Number, default: 0 },
  bloodOxygen: { type: Number, default: 0 },
  stressLevel: { type: String, default: 'Low' },
  bmiHistory: [
    {
      label: { type: String },
      value: { type: Number }
    }
  ],
  medicalRecords: [
    {
      name: { type: String },
      date: { type: String },
      size: { type: String },
      data: { type: String }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HealthReport', healthReportSchema);
