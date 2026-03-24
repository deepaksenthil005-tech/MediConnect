const express = require('express');
const router = express.Router();
const { registerPatient, loginPatient, updateProfile } = require('../controllers/patientAuthController');
const { protectPatient } = require('../middlewares/authMiddleware');

router.post('/register', registerPatient);
router.post('/login', loginPatient);
router.put('/profile', protectPatient, updateProfile);

module.exports = router;
