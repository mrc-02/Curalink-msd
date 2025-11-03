const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No-Show'],
    default: 'Pending'
  },
  type: {
    type: String,
    enum: ['Consultation', 'Follow-up', 'Emergency', 'Routine Check-up'],
    default: 'Consultation'
  },
  symptoms: {
    type: String,
    maxlength: 500
  },
  notes: String,
  cancellationReason: String,
  diagnosis: String,
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  },
  billing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Billing'
  }
}, {
  timestamps: true
});

// Index for faster queries
appointmentSchema.index({ patientId: 1, appointmentDate: 1 });
appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentDate: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);