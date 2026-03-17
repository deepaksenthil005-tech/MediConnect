import mongoose from "mongoose";

const bmiSchema = new mongoose.Schema({
  label: String,   // month (Jan, Feb...)
  value: Number,   // BMI value
});

const medicalRecordSchema = new mongoose.Schema({
  name: String,    // file name
  date: String,    // upload date
  size: String,    // file size
});

const healthReportSchema = new mongoose.Schema(
  {
    // 👤 Patient reference
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one report per patient
    },

    weight: Number,
    height: Number,
    heartRate: Number,
    bloodOxygen: Number,

    stressLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },

    // 📊 BMI History
    bmiHistory: [bmiSchema],

    // 📁 Medical files
    medicalRecords: [medicalRecordSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("HealthReport", healthReportSchema);