import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide vendor name'],
    },
    category: {
      type: [String],
      required: [true, 'Please provide at least one category (e.g. Plumbing, Electrical)'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide contact number'],
    },
    email: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
      default: 'default.jpg',
    },
    priceRange: {
      type: String,
      enum: ['budget', 'mid', 'premium'],
      default: 'mid',
    },
    availability: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;
