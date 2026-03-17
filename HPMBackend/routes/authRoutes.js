import express from "express";
import { register, login } from "../controller/authController.js";

const router = express.Router();

// 📝 Register
router.post("/register", register);

// 🔐 Login
router.post("/login", login);

export default router;