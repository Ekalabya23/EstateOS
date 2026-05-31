import mongoose from 'mongoose';

const rentGuaranteeSchema = new mongoose.Schema({
  lease: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  premiumAmount: {
    type: Number,
    required: true
  },
  coverageMonths: {
    type: Number,
    default: 3
  },
  status: {
    type: String,
    enum: ['active', 'claimed', 'expired'],
    default: 'active'
  },
  claimHistory: [{
    month: Date,
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'paid']
    },
    resolvedAt: Date
  }]
}, {
  timestamps: true
});

const RentGuarantee = mongoose.model('RentGuarantee', rentGuaranteeSchema);
export default RentGuarantee;
