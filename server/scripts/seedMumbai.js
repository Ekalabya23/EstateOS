import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

import User from '../src/models/User.js';
import Property from '../src/models/Property.js';
import Tenant from '../src/models/Tenant.js';
import Transaction from '../src/models/Transaction.js';
import MaintenanceTicket from '../src/models/MaintenanceTicket.js';

// Images for luxury properties
const propertyImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=2000'
];

// Locations around Mumbai
const locations = [
  { address: 'Carter Road', city: 'Mumbai', state: 'Maharashtra', zipCode: '400050', lat: 19.0664, lng: 72.8258, name: 'Bandra West' },
  { address: 'Pali Hill', city: 'Mumbai', state: 'Maharashtra', zipCode: '400050', lat: 19.0682, lng: 72.8277, name: 'Bandra West' },
  { address: 'Worli Sea Face', city: 'Mumbai', state: 'Maharashtra', zipCode: '400018', lat: 19.0169, lng: 72.8156, name: 'Worli' },
  { address: 'Annie Besant Road', city: 'Mumbai', state: 'Maharashtra', zipCode: '400018', lat: 19.0110, lng: 72.8166, name: 'Worli' },
  { address: 'Altamount Road', city: 'Mumbai', state: 'Maharashtra', zipCode: '400026', lat: 18.9667, lng: 72.8083, name: 'South Bombay' },
  { address: 'Malabar Hill', city: 'Mumbai', state: 'Maharashtra', zipCode: '400006', lat: 18.9548, lng: 72.7985, name: 'South Bombay' },
  { address: 'Juhu Tara Road', city: 'Mumbai', state: 'Maharashtra', zipCode: '400049', lat: 19.0974, lng: 72.8264, name: 'Juhu' },
  { address: 'Juhu Scheme', city: 'Mumbai', state: 'Maharashtra', zipCode: '400049', lat: 19.1065, lng: 72.8339, name: 'Juhu' },
  { address: 'Hiranandani Gardens', city: 'Mumbai', state: 'Maharashtra', zipCode: '400076', lat: 19.1197, lng: 72.9090, name: 'Powai' },
  { address: 'JVLR', city: 'Mumbai', state: 'Maharashtra', zipCode: '400076', lat: 19.1245, lng: 72.9030, name: 'Powai' }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Wipe collections (except users to preserve sessions)
    await Property.deleteMany();
    await Tenant.deleteMany();
    await Transaction.deleteMany();
    await MaintenanceTicket.deleteMany();
    console.log('Cleared old data...');

    // 1. Find or create an admin/landlord owner
    let adminUser = await User.findOne({ role: { $in: ['admin', 'landlord'] } });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@estateos.com',
        password: 'password123',
        role: 'admin',
        onboardingCompleted: true
      });
      console.log('Created Admin User');
    }

    // 2. Create 50 Tenants and 50 Investors
    console.log('Creating Tenants & Investors...');
    const tenants = [];
    const investors = [];
    
    for (let i = 1; i <= 50; i++) {
      // Tenants
      let tenant = await User.findOne({ email: `tenant${i}@mumbai.com` });
      if (!tenant) {
        tenant = await User.create({
          name: `Tenant ${i}`,
          email: `tenant${i}@mumbai.com`,
          password: 'password123',
          role: 'tenant',
          onboardingCompleted: true
        });
      }
      tenants.push(tenant);

      // Investors
      let investor = await User.findOne({ email: `investor${i}@mumbai.com` });
      if (!investor) {
        investor = await User.create({
          name: `Investor ${i}`,
          email: `investor${i}@mumbai.com`,
          password: 'password123',
          role: 'user', // schema expects 'user', frontend treats 'user' as investor
          onboardingCompleted: true
        });
      }
      investors.push(investor);
    }
    console.log('Users created.');

    // 3. Generate 100 Properties
    console.log('Generating 100 Mumbai Properties...');
    const properties = [];
    
    for (let i = 1; i <= 100; i++) {
      // Pick a random location
      const loc = locations[Math.floor(Math.random() * locations.length)];
      // Add a tiny random offset so pins don't overlap exactly
      const lat = loc.lat + (Math.random() - 0.5) * 0.005;
      const lng = loc.lng + (Math.random() - 0.5) * 0.005;

      // Assign owner: ~70% admin, ~30% investors
      let ownerId = adminUser._id;
      if (Math.random() > 0.7) {
        ownerId = investors[Math.floor(Math.random() * investors.length)]._id;
      }

      // Assign property type
      const types = ['apartment', 'villa', 'penthouse'];
      const pType = types[Math.floor(Math.random() * types.length)];

      const prop = await Property.create({
        title: `Ultra-Luxury ${pType} in ${loc.name}`,
        description: `Experience the pinnacle of luxury living in this exquisite ${pType} located at ${loc.address}. Featuring panoramic views, state-of-the-art home automation, and world-class amenities. Designed by renowned architects, this property redefines modern elegance in the heart of Mumbai.`,
        address: loc.address,
        city: loc.city,
        state: loc.state,
        zipCode: loc.zipCode,
        price: Math.floor(Math.random() * 40000000) + 15000000, // 1.5Cr to 5.5Cr
        propertyType: pType,
        status: 'available',
        bedrooms: Math.floor(Math.random() * 4) + 2, // 2 to 5
        bathrooms: Math.floor(Math.random() * 4) + 2,
        area: Math.floor(Math.random() * 3000) + 1200, // 1200 to 4200 sqft
        images: [
          propertyImages[Math.floor(Math.random() * propertyImages.length)],
          propertyImages[Math.floor(Math.random() * propertyImages.length)]
        ],
        amenities: ['Sea View', 'Private Elevator', 'Smart Home', 'Infinity Pool', 'Gym'],
        featured: Math.random() > 0.8, // 20% featured
        owner: ownerId,
        coordinates: { lat, lng }
      });
      
      properties.push(prop);
    }
    console.log('Properties created.');

    // 4. Rent out some properties to the Tenants
    console.log('Creating leases...');
    for (let i = 0; i < tenants.length; i++) {
      // Assign property
      const p = properties[i];
      p.status = 'rented';
      await p.save();

      const startDate = new Date();
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);

      const rentAmount = Math.floor(Math.random() * 50000) + 40000;
      await Tenant.create({
        user: tenants[i]._id,
        property: p._id,
        owner: adminUser._id, // Assign the landlord as owner
        firstName: tenants[i].name.split(' ')[0],
        lastName: tenants[i].name.split(' ')[1] || 'Smith',
        email: tenants[i].email,
        phone: '+91 98765 43210',
        leaseStart: startDate,
        leaseEnd: endDate,
        rentAmount: rentAmount,
        securityDeposit: rentAmount * 3, // Standard 3 month deposit
        status: 'active',
        documents: []
      });
    }
    console.log('Leases created.');

    // 5. Generate Historical Transactions & Tickets
    console.log('Generating Analytics Data (Transactions & Tickets)...');
    for (let i = 0; i < properties.length; i++) {
      const p = properties[i];
      const pOwner = p.owner;
      
      // Random past transactions (rent income & maintenance expense)
      for (let j = 0; j < 6; j++) {
        // Random date in the last 6 months
        const date = new Date();
        date.setMonth(date.getMonth() - j);
        
        // Income (Rent)
        if (Math.random() > 0.3) {
          await Transaction.create({
            owner: pOwner,
            property: p._id,
            amount: Math.floor(Math.random() * 50000) + 40000,
            type: 'income',
            category: 'rent',
            description: `Monthly Rent for ${date.toLocaleString('default', { month: 'short', year: 'numeric' })}`,
            date: date
          });
        }

        // Expense (Maintenance/Taxes)
        if (Math.random() > 0.5) {
          await Transaction.create({
            owner: pOwner,
            property: p._id,
            amount: Math.floor(Math.random() * 15000) + 2000,
            type: 'expense',
            category: Math.random() > 0.5 ? 'maintenance' : 'tax',
            description: 'Property upkeep and taxes',
            date: date
          });
        }
      }

      // Generate Tickets
      if (Math.random() > 0.6 && p.status === 'rented') {
        // Find tenant for this property
        const t = await Tenant.findOne({ property: p._id });
        if (t) {
          const statuses = ['Open', 'In-Progress', 'Resolved'];
          const priorities = ['Low', 'Medium', 'High'];
          await MaintenanceTicket.create({
            title: 'Plumbing Issue',
            description: 'Leak in the master bathroom',
            category: 'Plumbing',
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            property: p._id,
            tenant: t.user,
            landlord: pOwner,
          });
        }
      }
    }
    console.log('Analytics Data created.');

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error with data seed', error);
    process.exit(1);
  }
};

seedData();
