const express = require('express');
const router = express.Router();
const { 
  getFeedback, submitFeedback,
  getNotifications, sendNotification,
  getHealthReport, saveHealthReport, addMedicalRecord, deleteMedicalRecord,
  getConsultationMessages, addConsultationMessage, getAllConsultations,
  getAdminStats, getPatients, deletePatient
} = require('../controllers/generalController');
const { protectPatient, protectAdmin, protectAny } = require('../middlewares/authMiddleware');



// Stats & Patients
router.get('/stats', protectAdmin, getAdminStats);
router.route('/patients')
  .get(protectAdmin, getPatients);
router.delete('/patients/:id', protectAdmin, deletePatient);

// Feedbacks
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
router.route('/reports/:patientId/records')
  .post(protectAny, addMedicalRecord);

router.delete('/reports/:patientId/records/:recordId', protectAny, deleteMedicalRecord);

// Consultations
router.route('/consultations')
  .get(protectAdmin, getAllConsultations);
router.route('/consultations/:patientId')
  .get(protectAny, getConsultationMessages)
  .post(protectAny, addConsultationMessage);

module.exports = router;

