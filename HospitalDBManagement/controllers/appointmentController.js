const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

/**
 * @desc    Get all appointments for a patient or all appointments for an admin
 * @route   GET /api/appointments
 * @access  Private (Patient/Admin)
 */
exports.getAppointments = async (req, res) => {
  try {
    let query = {};

    // Filter by patient ID if the requester is a patient
    if (req.user) {
      query = { patientId: req.user.id };
    } else if (!req.admin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const appointments = await Appointment.find(query)
      .populate('doctorId', 'name specialization imageUrl')
      .populate('patientId', 'name email')
      .sort({ createdAt: -1 });

    // Format the response to be consistent with frontend expectations (MERN style)
    const formatted = appointments.map(a => ({
      id: a._id,
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
    console.error('Get Appointments Error:', error);
    res.status(500).json({ message: 'Server error while fetching appointments' });
  }
};

/**
 * @desc    Create a new appointment
 * @route   POST /api/appointments
 * @access  Private (Patient)
 */
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;

    // Validate doctor existence
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    // Validate patient existence (from token)
    const patient = await Patient.findById(req.user.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    // Create the appointment with redundant descriptive fields for quick access
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
    console.error('Create Appointment Error:', error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Update appointment status (Admin only)
 * @route   PUT /api/appointments/:id/status
 * @access  Private (Admin)
 */
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Update appointment details (Patient or Admin)
 * @route   PUT /api/appointments/:id
 * @access  Private (Patient/Admin)
 */
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Authorization: Only the patient who owns the appointment OR an admin can update
    if (req.user && appointment.patientId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

