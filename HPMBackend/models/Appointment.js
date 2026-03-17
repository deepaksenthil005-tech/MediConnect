import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    // 👤 Patient (User reference)
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 👨‍⚕️ Doctor reference
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    // 📅 Appointment Date
    date: {
      type: String,
      required: true,
    },

    // ⏰ Time
    time: {
      type: String,
      required: true,
    },

    // 📌 Status
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },

    // 📝 Reason for visit
    reason: {
      type: String,
      default: "General Checkup",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Appointment", appointmentSchema);