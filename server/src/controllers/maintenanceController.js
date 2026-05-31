import MaintenanceTicket from '../models/MaintenanceTicket.js';
import Property from '../models/Property.js';
import Transaction from '../models/Transaction.js';
import { getIO } from '../socket.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Create a new maintenance ticket
// @route   POST /api/v1/maintenance
// @access  Private (Tenant)
export const createTicket = async (req, res) => {
  try {
    const { title, description, property, category, priority, beforeImages } = req.body;

    // Get the property to find the landlord
    const propertyData = await Property.findById(property);
    if (!propertyData) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Use Gemini for categorization and cost estimation
    let estimatedCost = 0;
    let aiCategory = category || 'General';
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Analyze this maintenance request: Title: "${title}", Description: "${description}". 
      Respond with ONLY a JSON object containing two fields: 
      1. "category" (one of: Plumbing, Electrical, HVAC, Structural, Appliance, General)
      2. "estimatedCostINR" (a rough estimated repair cost in INR based on Indian market rates).`;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      // Try to parse the JSON output
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const aiData = JSON.parse(jsonMatch[0]);
        aiCategory = aiData.category || aiCategory;
        estimatedCost = aiData.estimatedCostINR || 0;
      }
    } catch (err) {
      console.warn('Gemini estimation failed:', err.message);
    }

    const ticket = await MaintenanceTicket.create({
      title,
      description,
      property,
      tenant: req.user._id,
      landlord: propertyData.owner,
      category: aiCategory,
      priority,
      beforeImages: beforeImages || [],
      // Note: we'd need to add estimatedCost to the schema if we want to store it, 
      // but for now we'll just log it or add it to description if schema doesn't support it
      description: `${description}\n\n[AI Analysis]\nAuto-Categorized: ${aiCategory}\nEstimated Repair Cost: ₹${estimatedCost}`
    });

    // Simulated email to vendors
    console.log(`[EMAIL DISPATCH] Finding vendors for category: ${aiCategory}...`);
    console.log(`[EMAIL DISPATCH] Email sent to 3 local vendors with quote submission link: http://localhost:5173/quote/${ticket._id}/vendor-xyz`);

    // Notify landlord via sockets
    try {
      const io = getIO();
      io.to(propertyData.owner.toString()).emit('notification', {
        id: ticket._id,
        title: 'New Maintenance Request',
        message: `${req.user.name} reported a ${priority} priority issue at ${propertyData.title}`,
        type: 'maintenance',
        timestamp: new Date()
      });
    } catch (err) {
      console.log('Socket error:', err.message);
    }

    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create ticket', error: error.message });
  }
};

// @desc    Get all maintenance tickets
// @route   GET /api/v1/maintenance
// @access  Private
export const getTickets = async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'tenant') {
      query.tenant = req.user._id;
    } else {
      query.landlord = req.user._id;
    }

    const tickets = await MaintenanceTicket.find(query)
      .populate('property', 'title address city images')
      .populate('tenant', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch tickets', error: error.message });
  }
};

// @desc    Update a maintenance ticket
// @route   PATCH /api/v1/maintenance/:id
// @access  Private (Landlord)
export const updateTicket = async (req, res) => {
  try {
    const { status, contractor, cost, afterImages } = req.body;
    
    let ticket = await MaintenanceTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Ensure only landlord can update
    if (ticket.landlord.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this ticket' });
    }

    const isResolving = status === 'Resolved' || status === 'Closed';
    const wasResolved = ticket.status === 'Resolved' || ticket.status === 'Closed';

    ticket = await MaintenanceTicket.findByIdAndUpdate(
      req.params.id,
      {
        status: status || ticket.status,
        contractor: contractor || ticket.contractor,
        cost: cost !== undefined ? cost : ticket.cost,
        afterImages: afterImages || ticket.afterImages,
        completionDate: isResolving && !wasResolved ? new Date() : ticket.completionDate
      },
      { new: true, runValidators: true }
    );

    // If it's resolved and has a cost, create an expense transaction
    if (isResolving && !wasResolved && cost > 0) {
      await Transaction.create({
        owner: req.user._id,
        property: ticket.property,
        amount: cost,
        type: 'expense',
        category: 'maintenance',
        date: new Date(),
        description: `Maintenance repair: ${ticket.title}`
      });
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update ticket', error: error.message });
  }
};

// @desc    Get property health & maintenance timeline
// @route   GET /api/v1/maintenance/property/:propertyId
// @access  Private
export const getPropertyMaintenanceHealth = async (req, res) => {
  try {
    const tickets = await MaintenanceTicket.find({ property: req.params.propertyId })
      .populate('tenant', 'name')
      .sort('-createdAt');

    // Calculate dynamic health score
    let healthScore = 100;
    
    // Deductions
    const openUrgent = tickets.filter(t => t.status === 'Open' && t.priority === 'Urgent').length;
    const openHigh = tickets.filter(t => t.status === 'Open' && t.priority === 'High').length;
    const openMedium = tickets.filter(t => t.status === 'Open' && t.priority === 'Medium').length;
    
    healthScore -= (openUrgent * 10);
    healthScore -= (openHigh * 5);
    healthScore -= (openMedium * 2);

    // Ensure within bounds
    healthScore = Math.max(0, Math.min(100, healthScore));

    res.status(200).json({
      success: true,
      data: {
        healthScore,
        tickets
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch property health', error: error.message });
  }
};
