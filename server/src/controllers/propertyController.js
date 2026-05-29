import Property from '../models/Property.js';
import AppError from '../utils/AppError.js';

// @desc    Get all properties
// @route   GET /api/v1/properties
// @access  Private
export const getAllProperties = async (req, res, next) => {
  try {
    const query = {};

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

    res.status(200).json({
      success: true,
      data: property,
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
