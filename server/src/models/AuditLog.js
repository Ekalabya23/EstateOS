import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // In case of unauthenticated actions (like login failure)
    },
    action: {
      type: String,
      required: true, // e.g., 'CREATE_PROPERTY', 'UPDATE_TENANT', 'DELETE_TICKET'
    },
    resource: {
      type: String,
      required: true, // e.g., 'Property', 'Tenant'
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    details: {
      type: mongoose.Schema.Types.Mixed, // Can store previous value and new value
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
