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
    featured: {
      type: Boolean,
      default: false,
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
