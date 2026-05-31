import Property from '../models/Property.js';
import OwnershipHistory from '../models/OwnershipHistory.js';
import Tenant from '../models/Tenant.js';
import Transaction from '../models/Transaction.js';
import MaintenanceTicket from '../models/MaintenanceTicket.js';
import AppError from '../utils/AppError.js';

// @desc    Get all properties
// @route   GET /api/v1/properties
// @access  Private
export const getAllProperties = async (req, res, next) => {
  try {
    const query = {};

    // Filter by owner if myPortfolio is true
    if (req.query.myPortfolio === 'true' && req.user) {
      query.owner = req.user._id;
    }

    // Filtering
    if (req.query.propertyType) {
      query.propertyType = req.query.propertyType;
    }
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.city) {
      query.city = req.query.city;
    }
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.price.$lte = Number(req.query.maxPrice);
      }
    }

    // Sorting
    const sort = req.query.sort || '-createdAt';

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: properties.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        total,
      },
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property
// @route   GET /api/v1/properties/:id
// @access  Private
export const getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'owner',
      'name email'
    );

    if (!property) {
      return next(new AppError('Property not found', 404));
    }

    // Models are imported at the top

    const ownershipHistory = await OwnershipHistory.find({ property: property._id })
      .populate('previousOwner', 'name')
      .populate('newOwner', 'name')
      .sort('-purchaseDate');

    const tenantHistory = await Tenant.find({ property: property._id })
      .populate('user', 'name reputationScore')
      .sort('-leaseStart');

    const transactions = await Transaction.find({ property: property._id })
      .sort('-date')
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        ...property.toObject(),
        ownershipHistory,
        tenantHistory,
        transactions
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new property
// @route   POST /api/v1/properties
// @access  Private (landlord, admin)
export const createProperty = async (req, res, next) => {
  try {
    req.body.owner = req.user.id;

    const property = await Property.create(req.body);

    res.status(201).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property
// @route   PUT /api/v1/properties/:id
// @access  Private
export const updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return next(new AppError('Property not found', 404));
    }

    // Verify ownership
    if (
      property.owner.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new AppError('Not authorized to update this property', 403)
      );
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property
// @route   DELETE /api/v1/properties/:id
// @access  Private
export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return next(new AppError('Property not found', 404));
    }

    // Verify ownership
    if (
      property.owner.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new AppError('Not authorized to delete this property', 403)
      );
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get property statistics
// @route   GET /api/v1/properties/stats
// @access  Private
export const getPropertyStats = async (req, res, next) => {
  try {
    const [stats] = await Property.aggregate([
      {
        $facet: {
          overview: [
            {
              $group: {
                _id: null,
                totalProperties: { $sum: 1 },
                totalValue: { $sum: '$price' },
                avgPrice: { $avg: '$price' },
              },
            },
            {
              $project: {
                _id: 0,
                totalProperties: 1,
                totalValue: 1,
                avgPrice: { $round: ['$avgPrice', 2] },
              },
            },
          ],
          byStatus: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
              },
            },
          ],
          byType: [
            {
              $group: {
                _id: '$propertyType',
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    const overview = stats.overview[0] || {
      totalProperties: 0,
      totalValue: 0,
      avgPrice: 0,
    };

    res.status(200).json({
      success: true,
      data: {
        totalProperties: overview.totalProperties,
        totalValue: overview.totalValue,
        avgPrice: overview.avgPrice,
        byStatus: stats.byStatus,
        byType: stats.byType,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get portfolio stats for a specific user
// @route   GET /api/v1/properties/portfolio/stats
// @access  Private
export const getPortfolioStats = async (req, res, next) => {
  try {
    const ownerId = req.user._id;

    // 1. Calculate properties and total value
    const [propertyStats] = await Property.aggregate([
      { $match: { owner: ownerId } },
      {
        $group: {
          _id: null,
          totalProperties: { $sum: 1 },
          totalValue: { $sum: '$price' },
        },
      },
    ]);

    const totalProperties = propertyStats ? propertyStats.totalProperties : 0;
    const totalValue = propertyStats ? propertyStats.totalValue : 0;

    // 2. Calculate monthly yield from active tenants
    
    const [tenantStats] = await Tenant.aggregate([
      { $match: { owner: ownerId, status: 'active' } },
      {
        $group: {
          _id: null,
          monthlyYield: { $sum: '$rentAmount' },
        },
      },
    ]);

    const monthlyYield = tenantStats ? tenantStats.monthlyYield : 0;

    // 3. Calculate Annual Yield %
    let annualYieldPercent = 0;
    if (totalValue > 0) {
      annualYieldPercent = ((monthlyYield * 12) / totalValue) * 100;
    }

    res.status(200).json({
      success: true,
      data: {
        totalProperties,
        totalValue,
        monthlyYield,
        annualYieldPercent: Number(annualYieldPercent.toFixed(2)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Buy property (transfer ownership)
// @route   POST /api/v1/properties/:id/buy
// @access  Private (user/investor)
export const buyProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return next(new AppError('Property not found', 404));
    }

    if (property.status === 'sold') {
      return next(new AppError('Property is already sold', 400));
    }

    if (property.owner.toString() === req.user._id.toString()) {
      return next(new AppError('You already own this property', 400));
    }

    const oldOwnerId = property.owner;
    
    // Transfer ownership but keep status available for renting out
    property.owner = req.user._id;
    // We could mark it sold if it's meant to be taken off market, but investors want to rent it out.
    // For V2, let's keep it 'available' so tenants can still rent it, but the owner has changed!
    await property.save();

    // Models imported at the top

    // Create Ownership History Log
    await OwnershipHistory.create({
      property: property._id,
      previousOwner: oldOwnerId,
      newOwner: req.user._id,
      purchasePrice: property.price,
      purchaseDate: new Date(),
    });

    // Create Expense for Buyer (Investment)
    await Transaction.create({
      owner: req.user._id,
      property: property._id,
      amount: property.price,
      type: 'expense',
      category: 'other',
      description: 'Property Acquisition',
      date: new Date()
    });

    // Create Income for Seller (Sale)
    await Transaction.create({
      owner: oldOwnerId,
      property: property._id,
      amount: property.price,
      type: 'income',
      category: 'other',
      description: 'Property Sale',
      date: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Property acquired successfully',
      data: property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rent property (create lease)
// @route   POST /api/v1/properties/:id/rent
// @access  Private (tenant)
export const rentProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return next(new AppError('Property not found', 404));
    }

    if (property.status === 'rented') {
      return next(new AppError('Property is already rented', 400));
    }

    // Models imported at the top

    // Check if tenant already has an active lease
    const existingLease = await Tenant.findOne({ user: req.user._id, status: 'active' });
    if (existingLease) {
      return next(new AppError('You already have an active lease. Only one active lease per tenant is supported.', 400));
    }

    // 1. Update Property Status
    property.status = 'rented';
    await property.save();

    // 2. Create Lease
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);
    
    // Assume 0.3% of price is monthly rent for this simulation
    const rentAmount = Math.floor(property.price * 0.003);

    const tenant = await Tenant.create({
      user: req.user._id,
      property: property._id,
      owner: property.owner,
      firstName: req.user.name.split(' ')[0],
      lastName: req.user.name.split(' ')[1] || 'Tenant',
      email: req.user.email,
      phone: '+91 9999999999',
      leaseStart: startDate,
      leaseEnd: endDate,
      rentAmount: rentAmount,
      securityDeposit: rentAmount * 3,
      status: 'active'
    });

    // 3. Create Transactions (First month rent)
    await Transaction.create({
      owner: property.owner,
      tenant: tenant._id,
      property: property._id,
      amount: rentAmount,
      type: 'income',
      category: 'rent',
      description: 'First month rent payment (System checkout)',
      date: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Lease activated successfully',
      data: tenant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate Property Health Score
// @route   GET /api/v1/properties/:id/health
// @access  Private
export const calculatePropertyHealth = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return next(new AppError('Property not found', 404));
    }

    // Models imported at the top

    // 1. Maintenance Frequency
    const tickets = await MaintenanceTicket.find({ property: property._id });
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length;
    
    // Penalize if too many total tickets, heavily penalize if open tickets
    let maintenanceScore = 100 - (totalTickets * 2) - (openTickets * 10);
    if (maintenanceScore < 0) maintenanceScore = 0;

    // 2. Tenant Care (Reputation Score of past/current tenants)
    const leases = await Tenant.find({ property: property._id }).populate('user');
    let tenantCareScore = 100;
    if (leases.length > 0) {
      let totalReputation = 0;
      let count = 0;
      leases.forEach(lease => {
        if (lease.user && lease.user.reputationScore) {
          totalReputation += lease.user.reputationScore;
          count++;
        }
      });
      if (count > 0) {
        tenantCareScore = totalReputation / count; // Avg reputation score
      }
    }

    // 3. Occupancy Stability
    // Calculate how many months rented vs available
    // For now, simple mock based on number of leases
    let occupancyScore = 100 - (leases.length * 5); // Lots of turnover = lower stability
    if (property.status === 'available') occupancyScore -= 20;
    if (occupancyScore < 0) occupancyScore = 0;
    if (occupancyScore > 100) occupancyScore = 100;

    // Overall Score
    const overallScore = Math.floor((maintenanceScore * 0.4) + (tenantCareScore * 0.4) + (occupancyScore * 0.2));

    property.healthScore = overallScore;
    property.healthFactors = {
      maintenanceFrequency: Math.floor(maintenanceScore),
      tenantCare: Math.floor(tenantCareScore),
      occupancyStability: Math.floor(occupancyScore)
    };

    await property.save();

    res.status(200).json({
      success: true,
      data: {
        score: overallScore,
        factors: property.healthFactors
      }
    });
  } catch (error) {
    next(error);
  }
};
