const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  recordType: {
    type: String,
    enum: ['Lab Report', 'X-Ray', 'MRI', 'CT Scan', 'Prescription', 'Discharge Summary', 'Other'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  fileUrl: {
    type: String,
    required: true
  },
  fileType: String,
  fileSize: Number,
  uploadedBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: String
  },
  recordDate: {
    type: Date,
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  tags: [String],
  isConfidential: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
medicalRecordSchema.index({ patientId: 1, recordDate: -1 });
medicalRecordSchema.index({ recordType: 1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);