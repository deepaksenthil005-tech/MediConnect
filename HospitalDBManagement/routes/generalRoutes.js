const express = require('express');
const router = express.Router();
const { 
  getFeedback, submitFeedback,
  getNotifications, sendNotification,
  getHealthReport, saveHealthReport, addMedicalRecord,
  getConsultationMessages, addConsultationMessage, getAllConsultations,
  getAdminStats, getPatients, deletePatient
} = require('../controllers/generalController');
const { protectPatient, protectAdmin } = require('../middlewares/authMiddleware');

const jwt = require('jsonwebtoken');
const protectAny = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role === 'ADMIN') req.admin = decoded; else req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Stats & Patients
router.get('/stats', protectAdmin, getAdminStats);
router.route('/patients')
  .get(protectAdmin, getPatients);
router.delete('/patients/:id', protectAdmin, deletePatient);

// Feedback
router.route('/feedback')
  .get(protectAny, getFeedback)
  .post(protectPatient, submitFeedback);

// Notifications
router.route('/notifications')
  .get(protectAny, getNotifications)
  .post(protectAdmin, sendNotification);

// Health Reports
router.route('/reports/:patientId')
  .get(protectAny, getHealthReport)
  .put(protectAdmin, saveHealthReport);
router.post('/reports/:patientId/records', protectAdmin, addMedicalRecord);

// Consultations
router.route('/consultations')
  .get(protectAdmin, getAllConsultations);
router.route('/consultations/:patientId')
  .get(protectAny, getConsultationMessages)
  .post(protectAny, addConsultationMessage);

module.exports = router;
