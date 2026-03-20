const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');
const HealthReport = require('../models/HealthReport');
const Consultation = require('../models/Consultation');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// Feedback
exports.getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({});
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({});
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Health Reports
exports.getHealthReport = async (req, res) => {
  try {
    let report = await HealthReport.findOne({ patientId: req.params.patientId });
    if (!report) {
      report = await HealthReport.create({ patientId: req.params.patientId });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.saveHealthReport = async (req, res) => {
  try {
    const report = await HealthReport.findOneAndUpdate(
      { patientId: req.params.patientId },
      req.body,
      { new: true, upsert: true }
    );
    res.json({ success: true, report });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addMedicalRecord = async (req, res) => {
  try {
    const report = await HealthReport.findOne({ patientId: req.params.patientId });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    report.medicalRecords.push(req.body);
    await report.save();
    res.json(report.medicalRecords[report.medicalRecords.length - 1]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Consultations
exports.getConsultationMessages = async (req, res) => {
  try {
    const thread = await Consultation.findOne({ patientId: req.params.patientId });
    res.json(thread ? thread.messages : []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addConsultationMessage = async (req, res) => {
  try {
    let thread = await Consultation.findOne({ patientId: req.params.patientId });
    if (!thread) {
      thread = await Consultation.create({ patientId: req.params.patientId, messages: [] });
    }
    thread.messages.push(req.body);
    await thread.save();
    res.json(thread.messages[thread.messages.length - 1]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllConsultations = async (req, res) => {
  try {
    const threads = await Consultation.find({});
    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Stats
exports.getAdminStats = async (req, res) => {
  try {
    const doctors = await Doctor.countDocuments();
    const patients = await Patient.countDocuments();
    const today = new Date().toISOString().split('T')[0];
    
    // Simplistic aggregation for demo purposes
    const todayAppointments = await Appointment.countDocuments({ date: today });
    const pendingAppointments = await Appointment.countDocuments({ status: 'PENDING' });
    const completedAppointments = await Appointment.countDocuments({ status: 'COMPLETED' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'CANCELLED' });

    res.json({
      totalDoctors: doctors,
      totalPatients: patients,
      todayAppointments,
      pendingAppointments,
      completedAppointments,
      cancelledAppointments,
      appointmentsPerDay: [], // Simplified for now
      monthlyAppointments: [],
      doctorWiseAppointments: [],
      recentAppointments: await Appointment.find({}).sort({ createdAt: -1 }).limit(5)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Patients (for admin list)
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({}).select('-password');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
