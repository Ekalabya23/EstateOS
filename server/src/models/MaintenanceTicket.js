import mongoose from 'mongoose';

const maintenanceTicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a ticket title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['Plumbing', 'Electrical', 'HVAC', 'Furniture', 'Cleaning', 'Security', 'Painting', 'Other'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
      default: 'Open',
    },
    cost: {
      type: Number,
      default: 0,
    },
    contractor: {
      type: String,
    },
    beforeImages: {
      type: [String],
    },
    afterImages: {
      type: [String],
    },
    completionDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const MaintenanceTicket = mongoose.model('MaintenanceTicket', maintenanceTicketSchema);
export default MaintenanceTicket;
