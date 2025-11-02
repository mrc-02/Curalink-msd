const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Billing = require('../models/Billing');

// Admin dashboard stats
router.get('/admin/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });
    const completedAppointments = await Appointment.countDocuments({ status: 'Completed' });
    
    const totalRevenue = await Billing.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const recentAppointments = await Appointment.find()
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'firstName lastName profilePicture' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName profilePicture' }
      })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        pendingAppointments,
        completedAppointments,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentAppointments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin stats',
      error: error.message
    });
  }
});

// Doctor dashboard stats
router.get('/doctor/stats', protect, authorize('doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    const todayAppointments = await Appointment.countDocuments({
      doctorId: doctor._id,
      appointmentDate: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999)
      }
    });

    const pendingAppointments = await Appointment.countDocuments({
      doctorId: doctor._id,
      status: 'Pending'
    });

    const upcomingAppointments = await Appointment.find({
      doctorId: doctor._id,
      appointmentDate: { $gte: new Date() },
      status: { $in: ['Pending', 'Confirmed'] }
    })
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'firstName lastName profilePicture' }
      })
      .sort({ appointmentDate: 1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        todayAppointments,
        pendingAppointments,
        totalPatients: doctor.totalPatients,
        totalAppointments: doctor.totalAppointments,
        rating: doctor.rating,
        upcomingAppointments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor stats',
      error: error.message
    });
  }
});

// Patient dashboard stats
router.get('/patient/stats', protect, authorize('patient'), async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    const totalAppointments = await Appointment.countDocuments({
      patientId: patient._id
    });

    const upcomingAppointments = await Appointment.find({
      patientId: patient._id,
      appointmentDate: { $gte: new Date() },
      status: { $in: ['Pending', 'Confirmed'] }
    })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName profilePicture' }
      })
      .sort({ appointmentDate: 1 });

    const recentAppointments = await Appointment.find({
      patientId: patient._id,
      status: 'Completed'
    })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName profilePicture' }
      })
      .sort({ appointmentDate: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalAppointments,
        upcomingAppointments,
        recentAppointments,
        vitalSigns: patient.vitalSigns.slice(-5)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching patient stats',
      error: error.message
    });
  }
});

module.exports = router;