import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, enum: ['rent', 'maintenance', 'tax', 'insurance', 'utility', 'other'], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    description: { type: String, required: true, trim: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);
