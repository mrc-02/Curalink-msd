const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Billing = require('../models/Billing');

// @desc    Get admin dashboard statistics
// @route   GET /api/dashboard/admin/stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res) => {
  try {
    // Get counts
    const totalPatients = await Patient.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });
    const confirmedAppointments = await Appointment.countDocuments({ status: 'Confirmed' });
    const completedAppointments = await Appointment.countDocuments({ status: 'Completed' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'Cancelled' });

    // Get total revenue
    const revenueData = await Billing.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Get recent appointments
    const recentAppointments = await Appointment.find()
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'firstName lastName email profilePicture' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName email profilePicture' }
      })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get appointments by status
    const appointmentsByStatus = {
      pending: pendingAppointments,
      confirmed: confirmedAppointments,
      completed: completedAppointments,
      cancelled: cancelledAppointments
    };

    // Get new users this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    res.status(200).json({
      success: true,
      data: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        completedAppointments,
        cancelledAppointments,
        totalRevenue,
        recentAppointments,
        appointmentsByStatus,
        newUsersThisMonth
      }
    });
  } catch (error) {
    console.error('Get Admin Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin statistics',
      error: error.message
    });
  }
};

// @desc    Get doctor dashboard statistics
// @route   GET /api/dashboard/doctor/stats
// @access  Private (Doctor)
exports.getDoctorStats = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    // Today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await Appointment.countDocuments({
      doctorId: doctor._id,
      appointmentDate: { $gte: today, $lt: tomorrow }
    });

    // Pending appointments
    const pendingAppointments = await Appointment.countDocuments({
      doctorId: doctor._id,
      status: 'Pending'
    });

    // Upcoming appointments
    const upcomingAppointments = await Appointment.find({
      doctorId: doctor._id,
      appointmentDate: { $gte: new Date() },
      status: { $in: ['Pending', 'Confirmed'] }
    })
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'firstName lastName email phone profilePicture' }
      })
      .sort({ appointmentDate: 1, 'timeSlot.startTime': 1 })
      .limit(10);

    // This month's appointments
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const appointmentsThisMonth = await Appointment.countDocuments({
      doctorId: doctor._id,
      appointmentDate: { $gte: startOfMonth }
    });

    res.status(200).json({
      success: true,
      data: {
        todayAppointments,
        pendingAppointments,
        totalPatients: doctor.totalPatients,
        totalAppointments: doctor.totalAppointments,
        rating: doctor.rating,
        totalReviews: doctor.totalReviews,
        upcomingAppointments,
        appointmentsThisMonth
      }
    });
  } catch (error) {
    console.error('Get Doctor Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor statistics',
      error: error.message
    });
  }
};

// @desc    Get patient dashboard statistics
// @route   GET /api/dashboard/patient/stats
// @access  Private (Patient)
exports.getPatientStats = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    // Total appointments
    const totalAppointments = await Appointment.countDocuments({
      patientId: patient._id
    });

    // Upcoming appointments
    const upcomingAppointments = await Appointment.find({
      patientId: patient._id,
      appointmentDate: { $gte: new Date() },
      status: { $in: ['Pending', 'Confirmed'] }
    })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName email phone profilePicture' }
      })
      .sort({ appointmentDate: 1, 'timeSlot.startTime': 1 });

    // Recent appointments (completed)
    const recentAppointments = await Appointment.find({
      patientId: patient._id,
      status: 'Completed'
    })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName email phone profilePicture' }
      })
      .sort({ appointmentDate: -1 })
      .limit(5);

    // Latest vital signs
    const vitalSigns = patient.vitalSigns.slice(-5).reverse();

    res.status(200).json({
      success: true,
      data: {
        totalAppointments,
        upcomingAppointments,
        recentAppointments,
        vitalSigns
      }
    });
  } catch (error) {
    console.error('Get Patient Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient statistics',
      error: error.message
    });
  }
};