const mongoose = require('mongoose');
const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');
const HealthReport = require('../models/HealthReport');
const Consultation = require('../models/Consultation');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

/**
 * @desc    Get all feedback
 * @route   GET /api/feedback
 * @access  Public
 */
exports.getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({}).sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Submit new feedback
 * @route   POST /api/feedback
 * @access  Private (Patient)
 */
exports.submitFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Get all notifications
 * @route   GET /api/notifications
 * @access  Private (Any)
 */
exports.getNotifications = async (req, res) => {
  try {
    let query = {};
    if (req.admin) {
      // Admins see all notifications
      query = {};
    } else if (req.user) {
      // Patients see notifications for ALL or PATIENTS
      query = { target: { $in: ['ALL', 'PATIENTS'] } };
    }
    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Send a new notification
 * @route   POST /api/notifications
 * @access  Private (Admin)
 */
exports.sendNotification = async (req, res) => {
  try {
    const { title, message, type, target, category } = req.body;
    const notification = await Notification.create({
      title,
      message,
      type: type || 'INFO',
      target: target || 'ALL',
      category: category || 'SYSTEM'
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Get health report for a specific patient
 * @route   GET /api/reports/:patientId
 * @access  Private (Patient/Admin)
 */
exports.getHealthReport = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Auth check: Patient can only view their own report
    if (req.user && req.user.id !== patientId) {
      return res.status(403).json({ message: 'Not authorized to view this report' });
    }

    let report = await HealthReport.findOne({ patientId });
    if (!report) {
      report = await HealthReport.create({ patientId });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Save/Update health report summary
 * @route   PUT /api/reports/:patientId
 * @access  Private (Admin)
 */
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

/**
 * @desc    Add a medical record to patient's health report
 * @route   POST /api/reports/:patientId/records
 * @access  Private (Admin)
 */
exports.addMedicalRecord = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Auth check: Patient can only add to their own report
    if (req.user && req.user.id !== patientId) {
      return res.status(403).json({ message: 'Not authorized to update this report' });
    }

    const report = await HealthReport.findOne({ patientId });
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.medicalRecords.push(req.body);
    await report.save();
    res.json(report.medicalRecords[report.medicalRecords.length - 1]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Delete a medical record from patient's health report
 * @route   DELETE /api/reports/:patientId/records/:recordId
 * @access  Private (Patient/Admin)
 */
exports.deleteMedicalRecord = async (req, res) => {
  try {
    const { patientId, recordId } = req.params;

    // Auth check: Patient can only delete from their own report
    if (req.user && req.user.id !== patientId) {
      return res.status(403).json({ message: 'Not authorized to update this report' });
    }

    const report = await HealthReport.findOne({ patientId });
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.medicalRecords = report.medicalRecords.filter(
      (record) => record._id.toString() !== recordId
    );
    await report.save();
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Get all consultation messages for a patient
 * @route   GET /api/consultations/:patientId
 * @access  Private (Patient/Admin)
 */
exports.getConsultationMessages = async (req, res) => {
  try {
    const thread = await Consultation.findOne({ patientId: req.params.patientId });
    res.json(thread ? thread.messages : []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Add a message to a consultation thread
 * @route   POST /api/consultations/:patientId
 * @access  Private (Any)
 */
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

/**
 * @desc    Get all consultation threads (for admin overview)
 * @route   GET /api/consultations
 * @access  Private (Admin)
 */
exports.getAllConsultations = async (req, res) => {
  try {
    const threads = await Consultation.find({}).populate('patientId', 'name email');
    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get dashboard statistics for admin
 * @route   GET /api/stats
 * @access  Private (Admin)
 */
exports.getAdminStats = async (req, res) => {
  try {
    const doctorsCount = await Doctor.countDocuments();
    const patientsCount = await Patient.countDocuments();
    const appointmentsCount = await Appointment.countDocuments();

    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = await Appointment.countDocuments({ date: today });

    const pendingAppointments = await Appointment.countDocuments({ status: 'PENDING' });
    const completedAppointments = await Appointment.countDocuments({ status: 'COMPLETED' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'CANCELLED' });

    // Recent activities (formatted)
    const rawRecent = await Appointment.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('patientId', 'name')
      .populate('doctorId', 'name');

    const recentAppointments = rawRecent.map(apt => ({
      id: apt._id,
      patient_name: apt.patientName || apt.patientId?.name || 'Unknown',
      doctor_name: apt.doctorName || apt.doctorId?.name || 'Unknown',
      status: apt.status,
      date: apt.date
    }));

    // Data for charts
    // 1. Appointments per day (Last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const appointmentsPerDay = await Promise.all(last7Days.map(async (date) => {
      const count = await Appointment.countDocuments({ date });
      return { name: date, count };
    }));

    // 2. Monthly Appointments
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const monthlyAppointments = await Promise.all(months.map(async (month, index) => {
      // Simplistic approach: just count for the year
      const count = await Appointment.countDocuments({
        date: { $regex: `^${currentYear}-${(index + 1).toString().padStart(2, '0')}` }
      });
      return { name: month, count };
    }));

    // 3. Doctor-wise Appointments (Specialization distribution)
    const doctorWiseAppointments = await Appointment.aggregate([
      { $group: { _id: "$specialization", count: { $sum: 1 } } },
      { $project: { _id: 0, doctor: "$_id", count: 1 } }
    ]);

    res.json({
      totalDoctors: doctorsCount,
      totalPatients: patientsCount,
      totalAppointments: appointmentsCount,
      todayAppointments,
      pendingAppointments,
      completedAppointments,
      cancelledAppointments,
      recentAppointments,
      appointmentsPerDay,
      monthlyAppointments,
      doctorWiseAppointments: doctorWiseAppointments.length > 0 ? doctorWiseAppointments : [{ doctor: 'General', count: 0 }]
    });
  } catch (error) {
    console.error('Get Admin Stats Error:', error);
    res.status(500).json({ message: 'Error generating statistics' });
  }
};

/**
 * @desc    Get list of all patients
 * @route   GET /api/patients
 * @access  Private (Admin)
 */
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({}).select('-password').sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete a patient
 * @route   DELETE /api/patients/:id
 * @access  Private (Admin)
 */
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Deleting ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const patient = await Patient.findByIdAndDelete(id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient deleted successfully" });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

