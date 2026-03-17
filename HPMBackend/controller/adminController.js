import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import Notification from "../models/Notification.js";
import Feedback from "../models/Feedback.js";
import Consultation from "../models/Consultation.js";

// 👥 Get all patients
export const getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "USER" }).select("-password");
    res.json(patients);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ❌ Delete patient
export const deletePatient = async (req, res) => {
  try {
    const patient = await User.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ msg: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// 🔔 Get all notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ➕ Send notification
export const sendNotification = async (req, res) => {
  try {
    const { title, message, type, user } = req.body;

    const notification = await Notification.create({
      title,
      message,
      type,
      user: user || null,
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ⭐ Get all feedback
export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("patient", "name email")
      .populate("doctor", "name specialization")
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// 💬 Get all consultations
export const getAllConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find()
      .populate("patient", "name email")
      .sort({ updatedAt: -1 });

    res.json(consultations);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// 📊 Admin dashboard stats
export const getAdminStats = async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const totalPatients = await User.countDocuments({ role: "USER" });

    const appointments = await Appointment.find()
      .populate("patient", "name")
      .populate("doctor", "name specialization");

    const today = new Date().toISOString().split("T")[0];

    const todayAppointments = appointments.filter((a) => a.date === today).length;
    const pendingAppointments = appointments.filter((a) => a.status === "PENDING").length;
    const completedAppointments = appointments.filter((a) => a.status === "COMPLETED").length;
    const cancelledAppointments = appointments.filter((a) => a.status === "CANCELLED").length;

    const recentAppointments = appointments.slice(-5).reverse();

    res.json({
      totalDoctors,
      totalPatients,
      todayAppointments,
      pendingAppointments,
      completedAppointments,
      cancelledAppointments,
      recentAppointments,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};