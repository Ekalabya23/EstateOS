import mongoose from 'mongoose';

const propertyInspectionSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  lease: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant'
  },
  type: {
    type: String,
    enum: ['move-in', 'move-out', 'routine'],
    required: true
  },
  conductedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rooms: [{
    name: String,
    items: [{
      name: String,
      condition: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor']
      },
      notes: String,
      photos: [String]
    }]
  }],
  overallCondition: String,
  signedByTenant: {
    type: Boolean,
    default: false
  },
  signedByLandlord: {
    type: Boolean,
    default: false
  },
  depositDeduction: {
    type: Number,
    default: 0
  },
  deductionReason: String,
  completedAt: Date
}, {
  timestamps: true
});

const PropertyInspection = mongoose.model('PropertyInspection', propertyInspectionSchema);
export default PropertyInspection;
