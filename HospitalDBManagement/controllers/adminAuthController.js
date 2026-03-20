const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id, role: 'ADMIN' }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin email already exists' });
    }

    const admin = await Admin.create({ name, email, password });

    res.status(201).json({
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        imageUrl: admin.imageUrl
      },
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.comparePassword(password))) {
      res.json({
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          imageUrl: admin.imageUrl
        },
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
