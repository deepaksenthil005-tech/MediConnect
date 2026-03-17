import Doctor from "../models/Doctor.js";

// 📥 Get all doctors
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ➕ Add new doctor (Admin)
export const addDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✏️ Update doctor
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ❌ Delete doctor
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }

    res.json({ msg: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};