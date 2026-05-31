import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const THREESIXTY_IMAGES = [
  'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/2294472375_24a3b8ef46_o.jpg',
];

const STANDARD_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3',
  'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
  'https://images.unsplash.com/photo-1600585154526-990dced4ea0d',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
  'https://images.unsplash.com/photo-1576941089067-2de3c901e126',
  'https://images.unsplash.com/photo-1605276374104-a628b0f00ce6',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea',
  'https://images.unsplash.com/photo-1628012198051-50e8d2f702e5',
  'https://images.unsplash.com/photo-1600607688969-a5bfcd64bd28',
  'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099',
  'https://images.unsplash.com/photo-1600566752229-250da454bce5'
].map(url => `${url}?auto=format&fit=crop&q=80&w=2000`);

const DESCRIPTIONS = [
  { category: 'maintenance', text: 'Full Kitchen Renovation (Marble & Appliances)' },
  { category: 'maintenance', text: 'HVAC System Upgrade' },
  { category: 'maintenance', text: 'Roof Repair & Waterproofing' },
  { category: 'tax', text: 'Annual Property Tax Assessment Paid' },
  { category: 'insurance', text: 'Premium Asset Insurance Renewal' },
  { category: 'other', text: 'Third-party Asset Valuation & Appraisal' },
  { category: 'other', text: 'Interior Design Consulting Fees' },
];

const injectMoreData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Using string schemas to bypass strict mode
    const Property = mongoose.model('Property', new mongoose.Schema({ images: [String], owner: String }, { strict: false }));
    const Transaction = mongoose.model('Transaction', new mongoose.Schema({
      type: String, category: String, amount: Number, date: Date, description: String, property: String, owner: String
    }, { strict: false }));

    const properties = await Property.find({});
    console.log(`Found ${properties.length} properties to update.`);

    for (let p of properties) {
      // 1. Update Images
      const shuffled = [...STANDARD_IMAGES].sort(() => 0.5 - Math.random());
      p.images = [
        THREESIXTY_IMAGES[0],
        shuffled[0],
        shuffled[1],
        shuffled[2],
        shuffled[3]
      ];
      await p.save();

      // 2. Inject 1 to 4 random historical events (transactions)
      const numEvents = Math.floor(Math.random() * 4) + 1;
      for (let i = 0; i < numEvents; i++) {
        const randEvent = DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)];
        const amount = Math.floor(Math.random() * 50000) + 1000;
        
        // Random date in the last 2 years
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 700));

        await Transaction.create({
          type: 'expense',
          category: randEvent.category,
          amount: amount,
          date: date,
          description: randEvent.text,
          property: p._id,
          owner: p.owner
        });
      }
    }

    console.log('Successfully injected diverse images and ledger transactions!');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

injectMoreData();
