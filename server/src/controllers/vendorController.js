import Vendor from '../models/Vendor.js';
import MaintenanceTicket from '../models/MaintenanceTicket.js';

// @desc    Get all vendors
// @route   GET /api/v1/vendors
// @access  Private (admin, landlord)
export const getVendors = async (req, res) => {
  try {
    const query = {};
    if (req.query.category) query.category = { $in: [req.query.category] };
    if (req.query.city) query.city = req.query.city;

    const vendors = await Vendor.find(query).sort('-rating');

    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Hire a vendor for a maintenance ticket
// @route   POST /api/v1/vendors/:id/hire
// @access  Private (admin, landlord)
export const hireVendor = async (req, res) => {
  try {
    const { ticketId } = req.body;
    const vendorId = req.params.id;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    const ticket = await MaintenanceTicket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // In a real app we'd add vendor to ticket schema. For now, add to description or close ticket.
    ticket.description = ticket.description + `\n\n[Assigned Vendor: ${vendor.name} (${vendor.phone})]`;
    ticket.status = 'In Progress'; // or 'Resolved' if they already finished it
    await ticket.save();

    res.status(200).json({
      success: true,
      message: `Vendor ${vendor.name} hired successfully for ticket ${ticket.title}`,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Review a vendor
// @route   POST /api/v1/vendors/:id/review
// @access  Private
export const reviewVendor = async (req, res) => {
  try {
    const { rating } = req.body;
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    // Calculate new average rating
    const newCount = vendor.reviewCount + 1;
    const newRating = ((vendor.rating * vendor.reviewCount) + Number(rating)) / newCount;

    vendor.rating = Number(newRating.toFixed(1));
    vendor.reviewCount = newCount;

    await vendor.save();

    res.status(200).json({
      success: true,
      message: 'Vendor reviewed successfully',
      data: vendor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
