import mongoose from 'mongoose';

const ownershipHistorySchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    previousOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    newOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    purchasePrice: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
    },
    holdingPeriodDays: {
      type: Number,
    },
    roiPercentage: {
      type: Number,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    saleDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const OwnershipHistory = mongoose.model('OwnershipHistory', ownershipHistorySchema);
export default OwnershipHistory;
