import express from "express";
import {
  getDoctors,
  addDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controller/doctorController.js";

const router = express.Router();

// 📥 Get all doctors
router.get("/", getDoctors);

// ➕ Add doctor (Admin)
router.post("/", addDoctor);

// ✏️ Update doctor
router.put("/:id", updateDoctor);

// ❌ Delete doctor
router.delete("/:id", deleteDoctor);

export default router;