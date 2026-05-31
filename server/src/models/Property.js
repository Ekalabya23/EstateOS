import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a property title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    address: {
      type: String,
      required: [true, 'Please provide an address'],
    },
    city: {
      type: String,
      required: [true, 'Please provide a city'],
    },
    state: {
      type: String,
      required: [true, 'Please provide a state'],
    },
    zipCode: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
    },
    propertyType: {
      type: String,
      enum: ['apartment', 'villa', 'penthouse', 'commercial', 'land'],
      required: [true, 'Please provide a property type'],
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'rented', 'under-review'],
      default: 'available',
    },
    bedrooms: {
      type: Number,
    },
    bathrooms: {
      type: Number,
    },
    area: {
      type: Number,
      required: [true, 'Please provide the area in sqft'],
    },
    images: {
      type: [String],
    },
    amenities: {
      type: [String],
    },
    documents: {
      type: [String], // Array of URLs to PDFs/Docs
    },
    floorPlans: {
      type: [String], // Array of URLs to floor plan images
    },
    featured: {
      type: Boolean,
      default: false,
    },
    healthScore: {
      type: Number,
      default: 100, // Starts at 100, dynamically calculated later or updated by cron
    },
    healthFactors: {
      maintenanceFrequency: { type: Number, default: 100 }, // 100 = perfect (few tickets), 0 = terrible
      occupancyStability: { type: Number, default: 100 },
      tenantCare: { type: Number, default: 100 },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide the property owner'],
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual id getter
propertySchema.virtual('id').get(function () {
  return this._id;
});

const Property = mongoose.model('Property', propertySchema);
export default Property;
