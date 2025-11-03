const express = require('express');
const router = express.Router();
const {
  getAppointments,
  createAppointment,
  getAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getUpcomingAppointments
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAppointments)
  .post(authorize('patient'), createAppointment);

router.get('/upcoming', getUpcomingAppointments);

router.route('/:id')
  .get(getAppointment)
  .put(updateAppointment)
  .delete(deleteAppointment);

router.patch('/:id/status', authorize('doctor', 'admin'), updateAppointmentStatus);

module.exports = router;