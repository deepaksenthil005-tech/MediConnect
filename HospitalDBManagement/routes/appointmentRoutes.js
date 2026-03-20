const express = require('express');
const router = express.Router();
const { getAppointments, createAppointment, updateAppointmentStatus, updateAppointment } = require('../controllers/appointmentController');
const { protectPatient, protectAdmin } = require('../middlewares/authMiddleware');

// Custom middleware to allow either Patient OR Admin to access this route
const protectAny = async (req, res, next) => {
  let token;
  const jwt = require('jsonwebtoken');
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role === 'ADMIN') {
        req.admin = decoded;
      } else {
        req.user = decoded;
      }
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

router.route('/')
  .get(protectAny, getAppointments)
  .post(protectPatient, createAppointment);

router.route('/:id/status')
  .put(protectAdmin, updateAppointmentStatus);

router.route('/:id')
  .put(protectAdmin, updateAppointment);

module.exports = router;
