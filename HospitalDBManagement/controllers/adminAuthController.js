const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id, role: 'ADMIN' }, process.env.JWT_SECRET || 'supersecretmedicalkey123', {
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
        imageUrl: admin.imageUrl,
        phone: admin.phone,
        age: admin.age,
        gender: admin.gender
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
          imageUrl: admin.imageUrl,
          phone: admin.phone,
          age: admin.age,
          gender: admin.gender
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

exports.updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    console.log('Admin found for update:', admin ? admin.email : 'NOT FOUND');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const { name, phone, age, gender, imageUrl } = req.body;
    console.log('Full update body:', req.body);
    
    if (name !== undefined) admin.name = name;
    if (phone !== undefined) admin.phone = phone;
    if (age !== undefined) admin.age = age;
    if (gender !== undefined) admin.gender = gender;
    if (imageUrl !== undefined) admin.imageUrl = imageUrl;

    const updatedAdmin = await admin.save();
    console.log('Update successful, saved fields:', { 
      phone: updatedAdmin.phone, 
      age: updatedAdmin.age, 
      gender: updatedAdmin.gender 
    });

    res.json({
      user: {
        id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        imageUrl: updatedAdmin.imageUrl,
        phone: updatedAdmin.phone,
        age: updatedAdmin.age,
        gender: updatedAdmin.gender
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
