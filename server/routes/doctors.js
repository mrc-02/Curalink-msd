const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctor,
  updateDoctor,
  getDoctorAvailability,
  updateDoctorAvailability,
  getDoctorStats
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getDoctors);
router.get('/:id', getDoctor);
router.get('/:id/availability', getDoctorAvailability);

// Protected routes
router.put('/:id', protect, authorize('doctor', 'admin'), updateDoctor);
router.put('/:id/availability', protect, authorize('doctor', 'admin'), updateDoctorAvailability);
router.get('/:id/stats', protect, authorize('doctor', 'admin'), getDoctorStats);

module.exports = router;