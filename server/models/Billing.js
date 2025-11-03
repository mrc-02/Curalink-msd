const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [{
    description: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    },
    unitPrice: {
      type: Number,
      required: true
    },
    total: Number
  }],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Partially Paid', 'Overdue', 'Cancelled'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'Insurance', 'Online', 'Other']
  },
  paymentDate: Date,
  dueDate: Date,
  notes: String,
  insuranceClaim: {
    claimNumber: String,
    provider: String,
    claimedAmount: Number,
    approvedAmount: Number,
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected']
    }
  }
}, {
  timestamps: true
});

// Generate invoice number before saving
billingSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const count = await this.constructor.countDocuments();
    this.invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Index for faster queries
billingSchema.index({ patientId: 1, createdAt: -1 });
billingSchema.index({ status: 1 });
billingSchema.index({ invoiceNumber: 1 });

module.exports = mongoose.model('Billing', billingSchema);