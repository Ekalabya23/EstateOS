import FractionalProperty from '../models/FractionalProperty.js';
import Property from '../models/Property.js';
import AppError from '../utils/AppError.js';

export const getFractionalProperty = async (req, res, next) => {
  try {
    const fraction = await FractionalProperty.findOne({ property: req.params.propertyId })
      .populate('property')
      .populate('investors.user', 'firstName lastName');

    if (!fraction) {
      return res.status(200).json({
        success: true,
        data: null
      });
    }

    res.status(200).json({
      success: true,
      data: fraction
    });
  } catch (error) {
    next(error);
  }
};

export const buyShares = async (req, res, next) => {
  try {
    const { sharesToBuy } = req.body;
    const fraction = await FractionalProperty.findOne({ property: req.params.propertyId });

    if (!fraction) {
      return next(new AppError('Fractional details not found', 404));
    }

    if (fraction.availableShares < sharesToBuy) {
      return next(new AppError(`Only ${fraction.availableShares} shares available`, 400));
    }

    // Process payment here in a real app...
    
    // Update fraction logic
    fraction.availableShares -= sharesToBuy;
    fraction.investors.push({
      user: req.user.id,
      sharesOwned: sharesToBuy,
      purchaseDate: Date.now(),
      purchasePrice: fraction.pricePerShare * sharesToBuy
    });

    if (fraction.availableShares === 0) {
      fraction.fundingStatus = 'funded';
    }

    await fraction.save();

    res.status(200).json({
      success: true,
      message: `Successfully purchased ${sharesToBuy} shares!`,
      data: fraction
    });
  } catch (error) {
    next(error);
  }
};
