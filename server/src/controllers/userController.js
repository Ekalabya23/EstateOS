import User from '../models/User.js';

// @desc    Toggle save property
// @route   POST /api/v1/users/saved/:propertyId
// @access  Private
export const toggleSaveProperty = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { propertyId } = req.params;

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isSaved = user.savedProperties.includes(propertyId);

    if (isSaved) {
      user.savedProperties = user.savedProperties.filter(id => id.toString() !== propertyId);
    } else {
      user.savedProperties.push(propertyId);
    }

    await user.save();

    res.status(200).json({ 
      success: true, 
      message: isSaved ? 'Property removed from saved' : 'Property saved',
      data: user.savedProperties 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get all saved properties
// @route   GET /api/v1/users/saved
// @access  Private
export const getSavedProperties = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedProperties');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ 
      success: true, 
      count: user.savedProperties.length,
      data: user.savedProperties 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Complete Onboarding
// @route   POST /api/v1/users/onboarding-complete
// @access  Private
export const completeOnboarding = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.onboardingCompleted = true;
    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update profile completion percentage and upload ID
// @route   PUT /api/v1/users/profile
// @access  Private
export const updateProfileCompletion = async (req, res) => {
  try {
    const { profileCompletion, idDocumentUrl } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (profileCompletion !== undefined) {
      user.profileCompletion = profileCompletion;
    }
    
    if (idDocumentUrl) {
      user.idDocuments.push(idDocumentUrl);
      user.verificationStatus.idVerified = true; // Auto-verify for MVP
    }

    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Mock Fast2SMS Verification
// @route   POST /api/v1/users/verify-phone
// @access  Private
export const verifyFast2SMSMock = async (req, res) => {
  try {
    // In a real app, you would use axios to call Fast2SMS API here.
    // For MVP, we simulate a successful OTP verification.
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.verificationStatus.phoneVerified = true;
    user.profileCompletion = Math.min(100, user.profileCompletion + 25);
    await user.save();

    res.status(200).json({ success: true, message: 'Phone verified successfully via Fast2SMS', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
