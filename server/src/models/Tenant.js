import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    leaseStart: { type: Date, required: true },
    leaseEnd: { type: Date, required: true },
    rentAmount: { type: Number, required: true },
    securityDeposit: { type: Number, required: true },
    status: { type: String, enum: ['active', 'past', 'pending'], default: 'active' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reputationScore: { type: Number, min: 0, max: 5 },
    reputationFeedback: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Tenant', tenantSchema);
