import express from "express";
import {
  getPatients,
  deletePatient,
  getNotifications,
  sendNotification,
  getFeedbacks,
  getAllConsultations,
  getAdminStats,
} from "../controller/adminController.js";

const router = express.Router();

// 👥 Get all patients
router.get("/patients", getPatients);

// ❌ Delete patient
router.delete("/patients/:id", deletePatient);

// 🔔 Notifications
router.get("/notifications", getNotifications);
router.post("/notifications", sendNotification);

// ⭐ Feedback
router.get("/feedbacks", getFeedbacks);

// 💬 Consultations
router.get("/consultations", getAllConsultations);

// 📊 Dashboard stats
router.get("/stats", getAdminStats);

export default router;