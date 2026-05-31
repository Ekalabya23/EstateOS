import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

// Setup transporter (use generic environment variables or fallbacks for development)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'test@example.com',
    pass: process.env.EMAIL_PASS || 'password',
  },
});

/**
 * Generic email sender function
 */
export const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `EstateOS <${process.env.EMAIL_USER || 'no-reply@estateos.com'}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USER) {
      logger.info(`[MOCK EMAIL] To: ${options.email} | Subject: ${options.subject}`);
      return;
    }

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to: ${options.email}`);
  } catch (error) {
    logger.error('Email could not be sent', error);
  }
};

/**
 * Specific Email Templates
 */

export const sendWelcomeEmail = async (user) => {
  const html = `
    <h1>Welcome to EstateOS, ${user.name}!</h1>
    <p>We are thrilled to have you on board. EstateOS is your comprehensive platform for managing luxury real estate properties seamlessly.</p>
    <p>Log in to your dashboard to get started.</p>
  `;
  await sendEmail({ email: user.email, subject: 'Welcome to EstateOS', html });
};

export const sendRentReminder = async (tenant, daysLeft) => {
  const html = `
    <h2>Rent Reminder</h2>
    <p>Dear ${tenant.user.name},</p>
    <p>This is a friendly reminder that your rent for <strong>${tenant.property.title}</strong> is due in ${daysLeft} days.</p>
    <p>Please ensure your payment is completed before the due date to avoid any late fees.</p>
  `;
  await sendEmail({ email: tenant.user.email, subject: `Upcoming Rent Due in ${daysLeft} Days`, html });
};

export const sendMaintenanceStatus = async (user, ticket) => {
  const html = `
    <h2>Maintenance Update</h2>
    <p>Dear ${user.name},</p>
    <p>The status of your maintenance ticket "<strong>${ticket.title}</strong>" has been updated to: <strong>${ticket.status}</strong>.</p>
    <p>Log in to your dashboard to view more details.</p>
  `;
  await sendEmail({ email: user.email, subject: `Maintenance Ticket Update: ${ticket.title}`, html });
};

export const sendLeaseExpiryWarning = async (tenant, daysLeft) => {
  const html = `
    <h2>Lease Expiry Notice</h2>
    <p>Dear ${tenant.user.name},</p>
    <p>Your lease for <strong>${tenant.property.title}</strong> is set to expire in ${daysLeft} days on ${new Date(tenant.leaseEnd).toDateString()}.</p>
    <p>Please contact your landlord to discuss renewal options or move-out procedures.</p>
  `;
  await sendEmail({ email: tenant.user.email, subject: `Lease Expires in ${daysLeft} Days`, html });
};

export const sendPaymentConfirmation = async (user, transaction) => {
  const html = `
    <h2>Payment Confirmation</h2>
    <p>Dear ${user.name},</p>
    <p>We have successfully received your payment of <strong>₹${transaction.amount}</strong> for ${transaction.category}.</p>
    <p>Transaction Reference: ${transaction.reference}</p>
    <p>Thank you for using EstateOS.</p>
  `;
  await sendEmail({ email: user.email, subject: 'Payment Received', html });
};

export const sendNewTenantNotification = async (landlord, tenant, property) => {
  const html = `
    <h2>New Tenant Acquired</h2>
    <p>Dear ${landlord.name},</p>
    <p>Good news! <strong>${tenant.name}</strong> has successfully activated the lease for your property: <strong>${property.title}</strong>.</p>
    <p>You can view the lease details in your landlord dashboard.</p>
  `;
  await sendEmail({ email: landlord.email, subject: `New Tenant for ${property.title}`, html });
};
