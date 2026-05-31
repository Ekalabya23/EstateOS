import cron from 'node-cron';
import Tenant from '../models/Tenant.js';
import { sendLeaseExpiryWarning, sendRentReminder } from '../services/emailService.js';
import logger from '../utils/logger.js';

export const startScheduler = () => {
  // Run daily at 9 AM
  cron.schedule('0 9 * * *', async () => {
    logger.info('Running daily automated jobs...');
    try {
      const today = new Date();
      
      // 1. Lease Expiry Warnings
      const ninetyDaysLater = new Date(today);
      ninetyDaysLater.setDate(ninetyDaysLater.getDate() + 90);
      
      const expiringLeases = await Tenant.find({
        status: 'active',
        leaseEnd: { 
          $gte: today, 
          $lte: ninetyDaysLater 
        }
      }).populate('property user');
      
      for (const lease of expiringLeases) {
        if (!lease.user) continue; // Skip if user reference is missing

        const daysLeft = Math.ceil((lease.leaseEnd - today) / (1000 * 60 * 60 * 24));
        // Send emails only exactly at 90, 60, and 30 days
        if (daysLeft === 90 || daysLeft === 60 || daysLeft === 30) {
          await sendLeaseExpiryWarning(lease, daysLeft);
        }
      }

      // 2. Rent Reminder (5 days before)
      // Assuming rent is due on the 5th of every month. 
      // 5 days before the 5th is the last day of the previous month or 1st.
      // A generic approach: check if today's date + 5 equals the rentDueDate (if stored)
      // For this implementation, we will just send it if it's the 1st of the month (for rent due on the 5th)
      if (today.getDate() === 1 || today.getDate() === 28) {
        const activeTenants = await Tenant.find({ status: 'active' }).populate('property user');
        for (const tenant of activeTenants) {
          if (!tenant.user) continue;
          const daysLeft = 5; // Fixed 5 days for this generic implementation
          await sendRentReminder(tenant, daysLeft);
        }
      }

      logger.info('Daily automated jobs completed successfully.');
    } catch (error) {
      logger.error('Error running daily automated jobs', error);
    }
  });

  logger.info('Automated job scheduler initialized.');
};
