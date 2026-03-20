const express = require('express');
const router = express.Router();
const { getDoctors, addDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctorController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getDoctors)
  .post(protectAdmin, addDoctor);

router.route('/:id')
  .put(protectAdmin, updateDoctor)
  .delete(protectAdmin, deleteDoctor);

module.exports = router;
