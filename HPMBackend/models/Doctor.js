import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Doctor email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    experience: {
      type: Number,
      required: [true, "Experience is required"],
      min: 0,
    },

    qualification: {
      type: String,
      required: [true, "Qualification is required"],
      trim: true,
    },

    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
    },

    availability: {
      type: String,
      required: [true, "Availability is required"],
      default: "Mon-Sun, 08:00-20:00",
    },

    bio: {
      type: String,
      required: [true, "Bio is required"],
      trim: true,
    },

    image_url: {
      type: String,
      default: "",
    },

    fee: {
      type: Number,
      required: [true, "Consultation fee is required"],
      min: 0,
    },

    status: {
      type: String,
      enum: ["Available", "Unavailable", "On Leave"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Doctor", doctorSchema);