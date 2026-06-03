import mongoose from 'mongoose';

const fractionalPropertySchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
    unique: true
  },
  totalShares: {
    type: Number,
    required: true,
    default: 10000
  },
  pricePerShare: {
    type: Number,
    required: true
  },
  availableShares: {
    type: Number,
    required: true
  },
  investors: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sharesOwned: Number,
    purchaseDate: Date,
    purchasePrice: Number
  }],
  dividendHistory: [{
    date: Date,
    totalAmount: Number,
    amountPerShare: Number,
    description: String
  }],
  fundingStatus: {
    type: String,
    enum: ['funding', 'funded', 'trading'],
    default: 'funding'
  }
}, {
  timestamps: true
});

fractionalPropertySchema.pre('save', function(next) {
  if (this.isNew && this.availableShares === undefined) {
    this.availableShares = this.totalShares;
  }
  next();
});

const FractionalProperty = mongoose.model('FractionalProperty', fractionalPropertySchema);
export default FractionalProperty;
