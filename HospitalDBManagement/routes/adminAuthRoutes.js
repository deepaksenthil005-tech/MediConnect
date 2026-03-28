const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, updateAdminProfile, getAdminProfile } = require('../controllers/adminAuthController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/me', protectAdmin, getAdminProfile);
router.put('/profile', protectAdmin, updateAdminProfile);

module.exports = router;
