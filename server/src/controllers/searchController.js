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

    // Parallelized text search with limit of 3
    const [propertyResults, userResults, leaseResults, ticketResults] = await Promise.all([
      Property.find({ $text: { $search: q } }).limit(3).select('title city propertyType status price'),
      User.find({ $text: { $search: q } }).limit(3).select('name email role'),
      Tenant.find({ $text: { $search: q } }).limit(3).select('firstName lastName property status'),
      MaintenanceTicket.find({ $text: { $search: q } }).limit(3).select('title category status priority')
    ]);

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
