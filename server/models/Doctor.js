const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    enum: [
      'Cardiology',
      'Dermatology',
      'Pediatrics',
      'Neurology',
      'Orthopedics',
      'Psychiatry',
      'General Medicine',
      'Gynecology',
      'Dentistry',
      'Ophthalmology',
      'ENT',
      'Oncology'
    ]
  },
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }],
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  bio: {
    type: String,
    maxlength: 1000
  },
  consultationFee: {
    type: Number,
    required: true,
    min: 0
  },
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    slots: [{
      startTime: String,
      endTime: String,
      isBooked: {
        type: Boolean,
        default: false
      }
    }]
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  languages: [String],
  awards: [String],
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  department: String,
  totalPatients: {
    type: Number,
    default: 0
  },
  totalAppointments: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
doctorSchema.index({ specialization: 1, rating: -1 });
doctorSchema.index({ userId: 1 });

module.exports = mongoose.model('Doctor', doctorSchema);