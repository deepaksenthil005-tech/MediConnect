import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    // 👤 Patient reference
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

    // ⭐ Rating (1 to 5)
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // 💬 Comment
    comment: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Feedback", feedbackSchema);