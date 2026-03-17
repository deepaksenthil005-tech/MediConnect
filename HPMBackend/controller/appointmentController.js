import Appointment from "../models/Appointment.js";

// 📥 Get appointments
export const getAppointments = async (req, res) => {
  try {
    const { userId, role } = req.query;

    let appointments;

    if (role === "ADMIN") {
      appointments = await Appointment.find()
        .populate("patient", "name email")
        .populate("doctor", "name specialization fee");
    } else {
      appointments = await Appointment.find({ patient: userId })
        .populate("patient", "name email")
        .populate("doctor", "name specialization fee");
    }

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ➕ Create appointment
export const createAppointment = async (req, res) => {
  try {
    const { patient, doctor, date, time, reason } = req.body;

    const appointment = await Appointment.create({
      patient,
      doctor,
      date,
      time,
      reason,
      status: "PENDING",
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("patient", "name email")
      .populate("doctor", "name specialization fee");

    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✏️ Update full appointment
export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("patient", "name email")
      .populate("doctor", "name specialization fee");

    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// 🔄 Update only status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("patient", "name email")
      .populate("doctor", "name specialization fee");

    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ❌ Delete appointment
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    res.json({ msg: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};