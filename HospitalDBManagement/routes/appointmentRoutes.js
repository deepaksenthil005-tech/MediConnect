const express = require('express');
const router = express.Router();
const { getAppointments, createAppointment, updateAppointmentStatus, updateAppointment } = require('../controllers/appointmentController');
const { protectPatient, protectAdmin, protectAny } = require('../middlewares/authMiddleware');


router.route('/')
  .get(protectAny, getAppointments)
  .post(protectPatient, createAppointment);

router.route('/:id/status')
  .put(protectAdmin, updateAppointmentStatus);

router.route('/:id')
  .put(protectAdmin, updateAppointment);

module.exports = router;
