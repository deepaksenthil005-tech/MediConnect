const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

exports.getAppointments = async (req, res) => {
  try {
    let appointments;
    if (req.user) {
      // Patient fetching their appointments
      appointments = await Appointment.find({ patientId: req.user.id })
        .populate('doctorId', 'name specialization')
        .populate('patientId', 'name');
    } else if (req.admin) {
      // Admin fetching all appointments
      appointments = await Appointment.find({})
        .populate('doctorId', 'name specialization')
        .populate('patientId', 'name');
    } else {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Format to match old localDb format
    const formatted = appointments.map(a => ({
      _id: a._id,
      patient_id: a.patientId?._id,
      doctor_id: a.doctorId?._id,
      patient_name: a.patientName,
      doctor_name: a.doctorName,
      specialization: a.specialization,
      date: a.date,
      time: a.time,
      status: a.status,
      reason: a.reason,
      created_at: a.createdAt
    }));
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;
    
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    
    const patient = await Patient.findById(req.user.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const newAppointment = await Appointment.create({
      patientId: patient._id,
      doctorId: doctor._id,
      patientName: patient.name,
      doctorName: doctor.name,
      specialization: doctor.specialization,
      date,
      time,
      reason,
      status: 'PENDING'
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Authorization check
    if (req.user && appointment.patientId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }
    // If req.admin, they can update anything.

    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
