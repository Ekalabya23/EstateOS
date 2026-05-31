import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../src/models/User.js';
import Property from '../src/models/Property.js';
import Tenant from '../src/models/Tenant.js';
import Transaction from '../src/models/Transaction.js';
import MaintenanceTicket from '../src/models/MaintenanceTicket.js';
import OwnershipHistory from '../src/models/OwnershipHistory.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const THREESIXTY_IMAGES = [
  'https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg',
  'https://photo-sphere-viewer-data.netlify.app/assets/sphere-test.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/4/4c/Equirectangular_projection_SW.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/f/f0/Interior_of_the_Temple_of_the_Emerald_Buddha_Equirectangular_panorama.jpg'
];

const STANDARD_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000',
];

const AMENITIES = ['Swimming Pool', 'Gym', 'Smart Home', '24/7 Security', 'Parking', 'Spa', 'Cinema Room', 'Helipad', 'Wine Cellar', 'Private Elevator'];
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Dubai', 'New York', 'London', 'Singapore', 'Miami'];
const TYPES = ['apartment', 'villa', 'penthouse', 'commercial'];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomSubset = (arr, num) => [...arr].sort(() => 0.5 - Math.random()).slice(0, num);

const seedEnterprise = async () => {
  await connectDB();
  
  try {
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Property.deleteMany({});
    await Tenant.deleteMany({});
    await Transaction.deleteMany({});
    await MaintenanceTicket.deleteMany({});
    await OwnershipHistory.deleteMany({});

    console.log('Generating Users...');
    const users = [];
    const password = await bcrypt.hash('password123', 10);

    // 20 Portfolio Managers (Admin)
    for (let i = 1; i <= 20; i++) {
      users.push({
        name: `Portfolio Manager ${i}`,
        email: `manager${i}@estateos.com`,
        password,
        role: 'admin',
        reputationScore: 100
      });
    }

    // 20 Investors / Landlords
    for (let i = 1; i <= 20; i++) {
      users.push({
        name: `Global Investor ${i}`,
        email: `investor${i}@estateos.com`,
        password,
        role: 'user', // "user" acts as Investor in our system, "landlord" also works
        reputationScore: randomInt(85, 99)
      });
    }

    // 50 Tenants
    for (let i = 1; i <= 50; i++) {
      users.push({
        name: `Elite Tenant ${i}`,
        email: `tenant${i}@estateos.com`,
        password,
        role: 'tenant',
        reputationScore: randomInt(70, 99)
      });
    }

    // Insert Users
    const insertedUsers = await User.insertMany(users);
    const admins = insertedUsers.filter(u => u.role === 'admin');
    const investors = insertedUsers.filter(u => u.role === 'user');
    const tenants = insertedUsers.filter(u => u.role === 'tenant');

    console.log(`Inserted ${insertedUsers.length} users.`);

    console.log('Generating 200 Properties with History...');
    const properties = [];
    for (let i = 1; i <= 200; i++) {
      const owner = randomItem(investors);
      
      // Select 3 random standard images, and 1 360 image
      const imgs = [
        randomItem(THREESIXTY_IMAGES), 
        ...randomSubset(STANDARD_IMAGES, 3)
      ];

      properties.push({
        title: `Luxury ${randomItem(TYPES).toUpperCase()} at ${randomItem(CITIES)}`,
        description: `Experience unparalleled luxury in this stunning property. Designed with meticulous attention to detail, it features state-of-the-art amenities and breathtaking views. A true masterpiece of modern architecture.`,
        address: `${randomInt(100, 999)} Elite Avenue`,
        city: randomItem(CITIES),
        state: 'Global',
        price: randomInt(5000000, 50000000), // 5M to 50M
        propertyType: randomItem(TYPES),
        status: Math.random() > 0.3 ? 'rented' : 'available',
        bedrooms: randomInt(2, 7),
        bathrooms: randomInt(2, 8),
        area: randomInt(1500, 10000),
        images: imgs,
        amenities: randomSubset(AMENITIES, randomInt(3, 8)),
        featured: Math.random() > 0.8,
        owner: owner._id,
        healthScore: randomInt(75, 100),
        healthFactors: {
          maintenanceFrequency: randomInt(80, 100),
          occupancyStability: randomInt(70, 100),
          tenantCare: randomInt(75, 100)
        }
      });
    }

    const insertedProperties = await Property.insertMany(properties);
    console.log(`Inserted ${insertedProperties.length} properties.`);

    console.log('Generating Ownership History & Tenant History...');
    const ownershipHistories = [];
    const tenantRecords = [];
    const transactions = [];
    const tickets = [];

    for (const prop of insertedProperties) {
      // 1. Ownership History (Mock previous owner transfer)
      if (Math.random() > 0.5) {
        const previousOwner = randomItem(investors);
        if (previousOwner._id.toString() !== prop.owner.toString()) {
          ownershipHistories.push({
            property: prop._id,
            previousOwner: previousOwner._id,
            newOwner: prop.owner,
            purchasePrice: prop.price * 0.8, // Appreciated 20%
            salePrice: prop.price,
            purchaseDate: new Date(new Date().setFullYear(new Date().getFullYear() - randomInt(1, 5))),
            holdingPeriodDays: randomInt(365, 1500),
            roiPercentage: 20
          });
        }
      }

      // 2. Tenant History
      if (prop.status === 'rented') {
        const tenantUser = randomItem(tenants);
        const rentAmount = Math.floor(prop.price * 0.003);
        const leaseStart = new Date();
        leaseStart.setMonth(leaseStart.getMonth() - randomInt(1, 11));
        const leaseEnd = new Date(leaseStart);
        leaseEnd.setFullYear(leaseEnd.getFullYear() + 1);

        const tenantDoc = await Tenant.create({
          user: tenantUser._id,
          property: prop._id,
          owner: prop.owner,
          firstName: tenantUser.name.split(' ')[0],
          lastName: tenantUser.name.split(' ')[1] || '',
          email: tenantUser.email,
          phone: `+91 ${randomInt(9000000000, 9999999999)}`,
          leaseStart,
          leaseEnd,
          rentAmount,
          securityDeposit: rentAmount * 3,
          status: 'active'
        });

        // 3. Rent Transactions
        for (let m = 0; m < 3; m++) {
          transactions.push({
            owner: prop.owner,
            tenant: tenantDoc._id,
            property: prop._id,
            amount: rentAmount,
            type: 'income',
            category: 'rent',
            description: `Monthly Rent - Month ${m+1}`,
            date: new Date(new Date().setMonth(new Date().getMonth() - m))
          });
        }
      }

      // 4. Maintenance Tickets
      const ticketCategories = ['Plumbing', 'Electrical', 'HVAC', 'Furniture', 'Cleaning', 'Other'];
      const priorities = ['Low', 'Medium', 'High', 'Urgent'];
      const ticketStatuses = ['Open', 'In-Progress', 'Resolved', 'Closed'];

      for (let t = 0; t < randomInt(0, 3); t++) {
        tickets.push({
          title: `${randomItem(ticketCategories)} Issue in ${prop.title.substring(0, 10)}...`,
          description: 'Standard maintenance requested for asset preservation.',
          property: prop._id,
          tenant: randomItem(tenants)._id,
          landlord: prop.owner,
          category: randomItem(ticketCategories),
          priority: randomItem(priorities),
          status: randomItem(ticketStatuses),
          createdAt: new Date(new Date().setDate(new Date().getDate() - randomInt(1, 30)))
        });
      }
    }

    await OwnershipHistory.insertMany(ownershipHistories);
    await Transaction.insertMany(transactions);
    await MaintenanceTicket.insertMany(tickets);

    console.log(`Inserted ${ownershipHistories.length} ownership logs.`);
    console.log(`Inserted ${transactions.length} financial transactions.`);
    console.log(`Inserted ${tickets.length} maintenance tickets.`);
    console.log('Enterprise Seeding Complete! 🚀');

    process.exit(0);
  } catch (error) {
    console.error('Error in Enterprise Seeding:', error);
    process.exit(1);
  }
};

seedEnterprise();
