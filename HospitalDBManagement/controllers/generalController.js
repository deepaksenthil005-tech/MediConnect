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
    const notifications = await Notification.find({}).sort({ createdAt: -1 });
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
    const notification = await Notification.create(req.body);
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
    const report = await HealthReport.findOne({ patientId: req.params.patientId });
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.medicalRecords.push(req.body);
    await report.save();
    res.json(report.medicalRecords[report.medicalRecords.length - 1]);
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

    // Get recent activities
    const recentAppointments = await Appointment.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('patientId', 'name')
      .populate('doctorId', 'name');

    res.json({
      totalDoctors: doctorsCount,
      totalPatients: patientsCount,
      totalAppointments: appointmentsCount,
      todayAppointments,
      pendingAppointments,
      completedAppointments,
      cancelledAppointments,
      recentAppointments
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

