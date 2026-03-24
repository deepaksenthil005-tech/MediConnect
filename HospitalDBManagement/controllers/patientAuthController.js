const Patient = require('../models/Patient');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id, role: 'USER' }, process.env.JWT_SECRET || 'supersecretmedicalkey123', {
    expiresIn: '30d',
  });
};

exports.registerPatient = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const patientExists = await Patient.findOne({ email });
    if (patientExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const patient = await Patient.create({ name, email, password });

    res.status(201).json({
      user: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        role: 'USER',
        imageUrl: patient.imageUrl
      },
      token: generateToken(patient._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });

    if (patient && (await patient.comparePassword(password))) {
      res.json({
        user: {
          id: patient._id,
          name: patient.name,
          email: patient.email,
          role: 'USER',
          imageUrl: patient.imageUrl
        },
        token: generateToken(patient._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log("Update Profile Request for ID:", req.user.id);
    console.log("Update Body:", req.body);
    
    const patient = await Patient.findById(req.user.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const { name, phone, age, gender, medicalHistory, imageUrl } = req.body;
    
    if (name) patient.name = name;
    if (phone) patient.phone = phone;
    if (age) patient.age = age;
    if (gender) patient.gender = gender;
    if (medicalHistory) patient.medicalHistory = medicalHistory;
    if (imageUrl) patient.imageUrl = imageUrl;

    const updatedPatient = await patient.save();

    res.json({
      user: {
        id: updatedPatient._id,
        name: updatedPatient.name,
        email: updatedPatient.email,
        role: 'USER',
        imageUrl: updatedPatient.imageUrl,
        phone: updatedPatient.phone,
        age: updatedPatient.age,
        gender: updatedPatient.gender,
        medicalHistory: updatedPatient.medicalHistory
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
