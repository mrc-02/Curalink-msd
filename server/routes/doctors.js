const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctor,
  updateDoctor,
  getDoctorAvailability,
  updateDoctorAvailability
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getDoctors);
router.get('/:id', getDoctor);
router.put('/:id', protect, authorize('doctor', 'admin'), updateDoctor);
router.get('/:id/availability', getDoctorAvailability);
router.put('/:id/availability', protect, authorize('doctor', 'admin'), updateDoctorAvailability);

module.exports = router;