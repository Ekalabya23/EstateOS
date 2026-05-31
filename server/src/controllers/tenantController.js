import Tenant from '../models/Tenant.js';

// @desc    Get all tenants
// @route   GET /api/v1/tenants
// @access  Private
export const getTenants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { owner: req.user._id };
    if (req.query.status) query.status = req.query.status;
    if (req.query.property) query.property = req.query.property;
    if (req.query.search) {
      query.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const sort = req.query.sort ? req.query.sort.split(',').join(' ') : '-createdAt';

    const tenants = await Tenant.find(query)
      .populate('property', 'title')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Tenant.countDocuments(query);

    res.status(200).json({
      success: true,
      count: tenants.length,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: tenants,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single tenant
// @route   GET /api/v1/tenants/:id
// @access  Private
export const getTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ _id: req.params.id, owner: req.user._id })
      .populate('property', 'title');

    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    res.status(200).json({ success: true, data: tenant });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create new tenant
// @route   POST /api/v1/tenants
// @access  Private
export const createTenant = async (req, res) => {
  try {
    req.body.owner = req.user._id;
    const tenant = await Tenant.create(req.body);
    res.status(201).json({ success: true, data: tenant });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
  }
};

// @desc    Update tenant
// @route   PUT /api/v1/tenants/:id
// @access  Private
export const updateTenant = async (req, res) => {
  try {
    let tenant = await Tenant.findOne({ _id: req.params.id, owner: req.user._id });

    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: tenant });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Bad Request', error: error.message });
  }
};

// @desc    Delete tenant
// @route   DELETE /api/v1/tenants/:id
// @access  Private
export const deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ _id: req.params.id, owner: req.user._id });

    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    await tenant.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get logged in user's lease
// @route   GET /api/v1/tenants/me
// @access  Private (Tenant)
export const getMyLease = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ user: req.user._id, status: 'active' }).populate('property');
    
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'No active lease found for this user' });
    }

    res.status(200).json({ success: true, data: tenant });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch lease', error: error.message });
  }
};

// @desc    Rate a tenant
// @route   POST /api/v1/tenants/:id/rate
// @access  Private (Landlord)
export const rateTenant = async (req, res) => {
  try {
    const { score, feedback } = req.body;
    let tenant = await Tenant.findById(req.params.id);
    
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    if (tenant.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to rate this tenant' });
    }

    tenant = await Tenant.findByIdAndUpdate(
      req.params.id,
      { reputationScore: score, reputationFeedback: feedback },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: tenant });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to rate tenant', error: error.message });
  }
};
