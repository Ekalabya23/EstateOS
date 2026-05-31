import Transaction from '../models/Transaction.js';
import { getIO } from '../socket.js';

// @desc    Get all transactions
// @route   GET /api/v1/transactions
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const query = { owner: req.user._id };
    if (req.query.type) query.type = req.query.type;
    if (req.query.category) query.category = req.query.category;
    if (req.query.property) query.property = req.query.property;

    const sort = req.query.sort ? req.query.sort.split(',').join(' ') : '-date';

    const transactions = await Transaction.find(query)
      .populate('property', 'title')
      .populate('tenant', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      count: transactions.length,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create new transaction
// @route   POST /api/v1/transactions
// @access  Private
export const createTransaction = async (req, res) => {
  try {
    req.body.owner = req.user._id;
    const transaction = await Transaction.create(req.body);

    // Emit real-time notification
    try {
      const io = getIO();
      io.to(req.user._id.toString()).emit('notification', {
        id: transaction._id,
        title: 'New Transaction',
        message: `A new ${transaction.type} of ₹${transaction.amount} was recorded.`,
        type: transaction.type,
        timestamp: new Date()
      });
    } catch (socketErr) {
      console.error('Socket not initialized or failed to emit:', socketErr);
    }

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/v1/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, owner: req.user._id });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    await transaction.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get transaction stats (for dashboard/financials)
// @route   GET /api/v1/transactions/stats
// @access  Private
export const getTransactionStats = async (req, res) => {
  try {
    const ownerId = req.user._id;

    // Aggregate totals by type
    const totals = await Transaction.aggregate([
      { $match: { owner: ownerId } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    totals.forEach(t => {
      if (t._id === 'income') totalIncome = t.total;
      if (t._id === 'expense') totalExpense = t.total;
    });

    const netIncome = totalIncome - totalExpense;

    // Monthly revenue for the current year
    const currentYear = new Date().getFullYear();
    const monthlyIncome = await Transaction.aggregate([
      { 
        $match: { 
          owner: ownerId, 
          type: 'income',
          date: { 
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31T23:59:59`)
          }
        } 
      },
      {
        $group: {
          _id: { $month: '$date' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueData = months.map((month, index) => {
      const monthData = monthlyIncome.find(m => m._id === index + 1);
      return {
        month,
        revenue: monthData ? monthData.total : 0
      };
    });

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        netIncome,
        revenueData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
