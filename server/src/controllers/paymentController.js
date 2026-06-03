import Razorpay from 'razorpay';
import crypto from 'crypto';
import Transaction from '../models/Transaction.js';
import Tenant from '../models/Tenant.js';
import { getIO } from '../socket.js';
import { env } from '../config/env.js';

const hasRazorpayConfig = Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET);

const razorpay = hasRazorpayConfig
  ? new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    })
  : null;

// @desc    Create Razorpay Order
// @route   POST /api/v1/payments/create-order
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = 'receipt#1' } = req.body;

    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
      });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'A valid amount is required' });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // amount in smallest currency unit
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      data: {
        ...order,
        keyId: env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Razorpay order creation failed', error: error.message });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/v1/payments/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, tenantId, propertyId } = req.body;

    if (!hasRazorpayConfig) {
      return res.status(503).json({
        success: false,
        message: 'Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Find the lease to get the landlord (owner)
      const lease = await Tenant.findById(tenantId);
      if (!lease) {
        return res.status(404).json({ success: false, message: 'Tenant lease not found' });
      }

      // Create transaction automatically
      const transaction = await Transaction.create({
        owner: lease.owner, // Credit the Landlord
        tenant: tenantId,
        property: propertyId,
        amount: amount,
        type: 'income',
        category: 'rent',
        date: new Date(),
        description: `Rent payment via Razorpay. Payment ID: ${razorpay_payment_id}`
      });

      // Emit real-time notification to the Landlord
      try {
        const io = getIO();
        io.to(lease.owner.toString()).emit('notification', {
          id: transaction._id,
          title: 'Rent Received',
          message: `A rent payment of ₹${transaction.amount.toLocaleString()} was just received from ${req.user.name} via Razorpay!`,
          type: 'income',
          timestamp: new Date()
        });
      } catch (socketErr) {
        console.error('Socket not initialized or failed to emit:', socketErr);
      }

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid signature',
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Payment verification failed', error: error.message });
  }
};
