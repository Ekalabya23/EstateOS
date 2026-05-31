import mongoose from 'mongoose';

const leaseTemplateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Standard 11-Month Residential Lease'
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clauses: [{
    section: String,
    content: String
  }],
  defaultDepositMonths: {
    type: Number,
    default: 2
  },
  lateFeePct: {
    type: Number,
    default: 2
  },
  noticePeriodDays: {
    type: Number,
    default: 30
  }
}, {
  timestamps: true
});

const LeaseTemplate = mongoose.model('LeaseTemplate', leaseTemplateSchema);
export default LeaseTemplate;
