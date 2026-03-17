import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ["PATIENT", "ADMIN", "DOCTOR"],
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const consultationSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Consultation", consultationSchema);