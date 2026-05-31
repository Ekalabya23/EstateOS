import Property from '../models/Property.js';
import User from '../models/User.js';
import Tenant from '../models/Tenant.js';
import MaintenanceTicket from '../models/MaintenanceTicket.js';

// @desc    Global Omni-Search
// @route   GET /api/v1/search
// @access  Private
export const globalSearch = async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(200).json({ success: true, data: [] });
    }

    const regex = new RegExp(q, 'i');

    // 1. Search Properties
    const propertyResults = await Property.find({
      $or: [
        { title: regex },
        { city: regex },
        { address: regex },
        { propertyType: regex }
      ]
    }).limit(5).select('title city propertyType status price');

    // 2. Search Users (Investors/Tenants/Landlords)
    const userResults = await User.find({
      $or: [
        { name: regex },
        { email: regex },
        { role: regex }
      ]
    }).limit(5).select('name email role');

    // 3. Search Leases (Tenants)
    const leaseResults = await Tenant.find({
      $or: [
        { firstName: regex },
        { lastName: regex },
        { email: regex }
      ]
    }).limit(5).select('firstName lastName property status');

    // 4. Search Tickets
    const ticketResults = await MaintenanceTicket.find({
      $or: [
        { title: regex },
        { category: regex },
        { status: regex }
      ]
    }).limit(5).select('title category status priority');

    // Format for OmniBar
    const formattedResults = [
      ...propertyResults.map(p => ({ type: 'property', id: p._id, title: p.title, subtitle: p.city, badge: p.status })),
      ...userResults.map(u => ({ type: 'user', id: u._id, title: u.name, subtitle: u.email, badge: u.role })),
      ...leaseResults.map(l => ({ type: 'lease', id: l._id, title: `${l.firstName} ${l.lastName}`, subtitle: `Lease - ${l.status}`, badge: 'tenant' })),
      ...ticketResults.map(t => ({ type: 'ticket', id: t._id, title: t.title, subtitle: t.category, badge: t.status }))
    ];

    res.status(200).json({
      success: true,
      data: formattedResults
    });
  } catch (error) {
    next(error);
  }
};
