const Patient = require('../models/Patient');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id, role: 'USER' }, process.env.JWT_SECRET, {
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
