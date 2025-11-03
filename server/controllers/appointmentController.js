const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { sendEmail, getAppointmentEmailTemplate } = require('../config/email');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
  try {
    let query = {};

    // Filter based on user role
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id });
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor profile not found'
        });
      }
      query.doctorId = doctor._id;
    } else if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user.id });
      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient profile not found'
        });
      }
      query.patientId = patient._id;
    }

    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query.appointmentDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const appointments = await Appointment.find(query)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'firstName lastName email phone profilePicture' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName email phone profilePicture' }
      })
      .sort({ appointmentDate: -1, 'timeSlot.startTime': 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Get Appointments Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private (Patient)
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, timeSlot, symptoms, type } = req.body;

    // Validate required fields
    if (!doctorId || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide doctor, appointment date, and time slot'
      });
    }

    // Get patient
    const patient = await Patient.findOne({ userId: req.user.id }).populate('userId');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId).populate('userId');
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check if appointment date is in the future
    const appointmentDateTime = new Date(appointmentDate);
    if (appointmentDateTime < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Appointment date must be in the future'
      });
    }

    // Check for conflicting appointments
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: appointmentDateTime,
      'timeSlot.startTime': timeSlot.startTime,
      status: { $in: ['Pending', 'Confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId,
      appointmentDate: appointmentDateTime,
      timeSlot: {
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime
      },
      symptoms,
      type: type || 'Consultation',
      status: 'Pending'
    });

    // Populate the appointment
    await appointment.populate([
      {
        path: 'patientId',
        populate: { path: 'userId', select: 'firstName lastName email phone profilePicture' }
      },
      {
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName email phone profilePicture' }
      }
    ]);

    // Send confirmation email to patient
    try {
      await sendEmail({
        email: patient.userId.email,
        subject: 'Appointment Confirmation - HealthCare Pro',
        html: getAppointmentEmailTemplate(appointment, patient.userId, doctor.userId)
      });
      console.log(`✅ Appointment confirmation email sent to ${patient.userId.email}`);
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError.message);
      // Continue even if email fails
    }

    // Update doctor's total appointments
    doctor.totalAppointments += 1;
    await doctor.save();

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully. Confirmation email has been sent.',
      data: appointment
    });
  } catch (error) {
    console.error('Create Appointment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating appointment',
      error: error.message
    });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'firstName lastName email phone profilePicture' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName email phone profilePicture' }
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check authorization
    const doctor = await Doctor.findOne({ userId: req.user.id });
    const patient = await Patient.findOne({ userId: req.user.id });

    const isAuthorized = 
      req.user.role === 'admin' ||
      (doctor && appointment.doctorId._id.toString() === doctor._id.toString()) ||
      (patient && appointment.patientId._id.toString() === patient._id.toString());

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this appointment'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment',
      error: error.message
    });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check authorization
    const doctor = await Doctor.findOne({ userId: req.user.id });
    const patient = await Patient.findOne({ userId: req.user.id });

    const isAuthorized = 
      req.user.role === 'admin' ||
      (doctor && appointment.doctorId.toString() === doctor._id.toString()) ||
      (patient && appointment.patientId.toString() === patient._id.toString());

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
    }

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate([
      {
        path: 'patientId',
        populate: { path: 'userId', select: 'firstName lastName email phone profilePicture' }
      },
      {
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName email phone profilePicture' }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating appointment',
      error: error.message
    });
  }
};

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id/status
// @access  Private (Doctor/Admin)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check authorization
    const doctor = await Doctor.findOne({ userId: req.user.id });
    
    const isAuthorized = 
      req.user.role === 'admin' ||
      (doctor && appointment.doctorId.toString() === doctor._id.toString());

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update appointment status'
      });
    }

    appointment.status = status;
    if (cancellationReason) {
      appointment.cancellationReason = cancellationReason;
    }

    await appointment.save();

    await appointment.populate([
      {
        path: 'patientId',
        populate: { path: 'userId', select: 'firstName lastName email phone profilePicture' }
      },
      {
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName email phone profilePicture' }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Appointment status updated successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating appointment status',
      error: error.message
    });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check authorization
    const patient = await Patient.findOne({ userId: req.user.id });
    
    const isAuthorized = 
      req.user.role === 'admin' ||
      (patient && appointment.patientId.toString() === patient._id.toString());

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this appointment'
      });
    }

    await appointment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting appointment',
      error: error.message
    });
  }
};

// @desc    Get upcoming appointments
// @route   GET /api/appointments/upcoming
// @access  Private
exports.getUpcomingAppointments = async (req, res) => {
  try {
    let query = {
      appointmentDate: { $gte: new Date() },
      status: { $in: ['Pending', 'Confirmed'] }
    };

    // Filter based on user role
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id });
      query.doctorId = doctor._id;
    } else if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user.id });
      query.patientId = patient._id;
    }

    const appointments = await Appointment.find(query)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'firstName lastName email phone profilePicture' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName email phone profilePicture' }
      })
      .sort({ appointmentDate: 1, 'timeSlot.startTime': 1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming appointments',
      error: error.message
    });
  }
};