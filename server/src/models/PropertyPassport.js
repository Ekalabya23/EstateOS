import mongoose from 'mongoose';

const propertyPassportSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  events: [{
    date: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['maintenance', 'renovation', 'inspection', 'ownership_transfer', 'valuation', 'legal'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    cost: Number,
    contractor: String,
    documents: [String],
    photos: [String],
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  healthScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  lastInspectionDate: Date,
  warrantyItems: [{
    item: String,
    expiryDate: Date,
    vendor: String
  }]
}, {
  timestamps: true
});

const PropertyPassport = mongoose.model('PropertyPassport', propertyPassportSchema);
export default PropertyPassport;
