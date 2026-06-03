import { GoogleGenerativeAI } from '@google/generative-ai';
import Property from '../models/Property.js';
import AppError from '../utils/AppError.js';
import { env } from '../config/env.js';

// Setup Gemini
const genAI = env.GEMINI_API_KEY ? new GoogleGenerativeAI(env.GEMINI_API_KEY) : null;
const getGeminiModel = () => {
  if (!genAI) {
    throw new AppError('Gemini is not configured. Please set GEMINI_API_KEY.', 503);
  }
  return genAI.getGenerativeModel({ model: env.GEMINI_MODEL });
};

const buildFallbackInsights = (properties = [], transactions = {}) => {
  const propertyCount = Array.isArray(properties) ? properties.length : 0;
  const occupiedCount = Array.isArray(properties)
    ? properties.filter((property) => property.status === 'occupied' || property.currentTenant).length
    : 0;
  const occupancyRate = propertyCount > 0 ? Math.round((occupiedCount / propertyCount) * 100) : 0;
  const totalIncome = transactions.totalIncome || transactions.income || 0;
  const totalExpense = transactions.totalExpense || transactions.expense || 0;
  const netIncome = totalIncome - totalExpense;

  return [
    {
      id: 'fallback-1',
      type: occupancyRate >= 80 ? 'success' : 'warning',
      icon: occupancyRate >= 80 ? 'TrendingUp' : 'AlertCircle',
      title: 'Occupancy Snapshot',
      desc: propertyCount
        ? `${occupancyRate}% of tracked properties appear occupied. Review vacant listings, pricing, and lead response time to improve portfolio yield.`
        : 'Add properties to your portfolio to unlock occupancy tracking and leasing recommendations.'
    },
    {
      id: 'fallback-2',
      type: netIncome >= 0 ? 'success' : 'warning',
      icon: netIncome >= 0 ? 'TrendingUp' : 'AlertCircle',
      title: 'Net Cash Flow',
      desc: `Current recorded net cash flow is ₹${netIncome.toLocaleString('en-IN')}. Keep rent, maintenance, and one-off expenses updated for sharper analysis.`
    },
    {
      id: 'fallback-3',
      type: 'info',
      icon: 'Lightbulb',
      title: 'Revenue Opportunity',
      desc: 'Compare rent against similar nearby properties and update amenities, photos, and descriptions for assets with weaker demand.'
    },
    {
      id: 'fallback-4',
      type: 'neutral',
      icon: 'UserCheck',
      title: 'Tenant Health',
      desc: 'Track lease expiry dates, rent payment history, and maintenance response times to identify tenant retention risks early.'
    },
    {
      id: 'fallback-5',
      type: 'info',
      icon: 'Sparkles',
      title: 'AI Temporarily Limited',
      desc: 'Live Gemini analysis is cooling down because the current API quota was reached, so EstateOS is showing rule-based insights for now.'
    }
  ];
};

// Feature 1: Generate Property Description
export const generateDescription = async (req, res, next) => {
  try {
    const { title, type, location, bedrooms, bathrooms, area, amenities } = req.body;
    
    const prompt = `You are a luxury real estate copywriter for the Indian premium market.
    Write a compelling 150-word property description for:
    - Property: ${title}
    - Type: ${type}
    - Location: ${location}
    - Bedrooms: ${bedrooms}, Bathrooms: ${bathrooms}
    - Area: ${area} sqft
    - Amenities: ${amenities?.join(', ')}
    
    Style: Sophisticated, aspirational, factual. No clichés.
    Format: Single flowing paragraph. No bullet points.`;
    
    const result = await getGeminiModel().generateContent(prompt);
    const description = result.response.text();
    
    res.json({ success: true, data: description });
  } catch (error) {
    next(new AppError('Failed to generate description: ' + error.message, 500));
  }
};

// Feature 2: Portfolio AI Insights
export const generateInsights = async (req, res, next) => {
  try {
    const { properties, transactions } = req.body;
    
    const prompt = `You are a real estate portfolio analyst AI for EstateOS.
    
    Analyze this portfolio data and return ONLY a valid JSON array (no markdown):
    
    Properties: ${JSON.stringify(properties?.slice(0, 10))}
    Financial Summary: ${JSON.stringify(transactions)}
    
    Return exactly this structure:
    [
      {
        "id": "1",
        "type": "warning|success|info|neutral",
        "icon": "AlertCircle|TrendingUp|Lightbulb|UserCheck|Sparkles",
        "title": "Insight title here",
        "desc": "Detailed actionable insight in 2 sentences"
      }
    ]
    
    Generate 5 insights covering: occupancy optimization, revenue opportunities, 
    maintenance risks, market positioning, portfolio diversification.
    Return ONLY the JSON array, nothing else.`;
    
    const result = await getGeminiModel().generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    const insights = JSON.parse(text);
    
    res.json({ success: true, data: insights });
  } catch (error) {
    console.warn('Gemini insights failed, using fallback insights:', error.message);
    const { properties, transactions } = req.body;
    res.json({
      success: true,
      data: buildFallbackInsights(properties, transactions),
      fallback: true,
      message: 'Live AI insights are temporarily unavailable, so fallback insights were generated.'
    });
  }
};

// Feature 3: Lease Contract Analyzer
export const analyzeLeaseContract = async (req, res, next) => {
  try {
    let contractText = req.body.contractText || '';

    // If PDF file was uploaded via multer, parse it
    if (req.file) {
      const pdfModule = await import('pdf-parse');
      const parsePDF = pdfModule.default || pdfModule;
      const pdfData = await parsePDF(req.file.buffer);
      contractText = pdfData.text;
    }

    if (!contractText || contractText.trim() === '') {
      return next(new AppError('Please provide contractText or upload a PDF file', 400));
    }
    
    const prompt = `You are a real estate legal AI assistant specialized in Indian property law.
    
    Analyze this lease agreement and return ONLY valid JSON (no markdown):
    
    Contract: ${contractText.substring(0, 8000)}
    
    Return exactly:
    {
      "summary": "2 sentence plain English summary",
      "keyTerms": {
        "rentAmount": "extracted value or null",
        "leaseStart": "extracted date or null", 
        "leaseEnd": "extracted date or null",
        "noticePeriod": "extracted value or null",
        "securityDeposit": "extracted value or null",
        "maintenanceResponsibility": "tenant/landlord/shared"
      },
      "redFlags": ["list of concerning clauses"],
      "tenantFavorable": ["clauses that benefit tenant"],
      "landlordFavorable": ["clauses that benefit landlord"],
      "missingClauses": ["important clauses not present"],
      "riskLevel": "low|medium|high",
      "recommendation": "sign|negotiate|reject with reason"
    }`;
    
    const result = await getGeminiModel().generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    const analysis = JSON.parse(text);
    
    res.json({ success: true, data: analysis });
  } catch (error) {
    next(new AppError('Failed to analyze contract: ' + error.message, 500));
  }
};

// Feature 4: Smart Property Valuation
export const valuateProperty = async (req, res, next) => {
  try {
    const { area, bedrooms, city, locality, amenities, propertyType, condition } = req.body;
    
    const prompt = `You are a real estate valuation AI with deep knowledge of Indian 
    property markets as of 2024.
    
    Provide valuation for:
    - City: ${city}, Locality: ${locality}
    - Type: ${propertyType}, Bedrooms: ${bedrooms}
    - Area: ${area} sqft
    - Amenities: ${amenities?.join(', ')}
    - Condition: ${condition || 'good'}
    
    Return ONLY valid JSON:
    {
      "estimatedValue": number in INR,
      "valueRange": { "low": number, "high": number },
      "estimatedRent": number per month in INR,
      "rentalYield": percentage number,
      "confidenceScore": 0-100,
      "marketTrend": "appreciating|stable|depreciating",
      "appreciationForecast": "next 2 year percentage estimate",
      "comparableFactors": ["list of factors that influenced valuation"],
      "recommendation": "buy|hold|sell with brief reason"
    }`;
    
    const result = await getGeminiModel().generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    const valuation = JSON.parse(text);
    
    res.json({ success: true, data: valuation });
  } catch (error) {
    next(new AppError('Failed to valuate property: ' + error.message, 500));
  }
};

// Feature 5: AI Property Chat Assistant
export const aiChat = async (req, res, next) => {
  try {
    const { message, propertyId, context } = req.body;
    
    let propertyContext = '';
    if (propertyId) {
      const property = await Property.findById(propertyId);
      if (property) {
        propertyContext = `Property details: ${JSON.stringify({
          title: property.title,
          type: property.propertyType,
          price: property.price,
          area: property.area,
          bedrooms: property.bedrooms,
          city: property.city,
          amenities: property.amenities
        })}`;
      }
    }
    
    const prompt = `You are EstateOS AI, a helpful luxury real estate assistant.
    
    ${propertyContext}
    User context: ${JSON.stringify(context || {})}
    
    User asks: ${message}
    
    Answer helpfully and concisely. Focus on Indian real estate market.
    If asked about specific property details not provided, say you don't have that info.
    Keep response under 150 words.`;
    
    const result = await getGeminiModel().generateContent(prompt);
    const reply = result.response.text();
    
    res.json({ success: true, data: reply });
  } catch (error) {
    next(new AppError('Failed to process chat: ' + error.message, 500));
  }
};

// Feature 6: Tenant Screening Analysis
export const screenTenant = async (req, res, next) => {
  try {
    const { tenantData, propertyRent } = req.body;
    
    const prompt = `You are a tenant screening AI for a luxury real estate platform.
    
    Analyze this tenant application:
    ${JSON.stringify(tenantData)}
    Property rent: ₹${propertyRent}/month
    
    Return ONLY valid JSON:
    {
      "overallScore": 0-100,
      "riskLevel": "low|medium|high",
      "recommendation": "approve|conditional|reject",
      "factors": {
        "incomeToRentRatio": "assessment",
        "employmentStability": "assessment", 
        "rentalHistory": "assessment"
      },
      "conditions": ["list of conditions if conditional approval"],
      "summary": "2 sentence summary for landlord"
    }`;
    
    const result = await getGeminiModel().generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    const screening = JSON.parse(text);
    
    res.json({ success: true, data: screening });
  } catch (error) {
    next(new AppError('Failed to screen tenant: ' + error.message, 500));
  }
};
