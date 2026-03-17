import express from "express";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from "../controller/appointmentController.js";

const router = express.Router();

// 📥 Get appointments
// (Admin → all, User → own)
router.get("/", getAppointments);

// ➕ Create appointment
router.post("/", createAppointment);

// ✏️ Full update
router.put("/:id", updateAppointment);

// 🔄 Update only status
router.patch("/:id/status", updateAppointmentStatus);

// ❌ Delete appointment
router.delete("/:id", deleteAppointment);

export default router;