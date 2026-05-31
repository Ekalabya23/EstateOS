import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const updateCoords = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const Property = mongoose.model('Property', new mongoose.Schema({ coordinates: { lat: Number, lng: Number } }, { strict: false }));
  
  const properties = await Property.find({});
  for (let p of properties) {
    // Random coords around Mumbai (19.0760, 72.8777)
    const lat = 19.0760 + (Math.random() - 0.5) * 0.1;
    const lng = 72.8777 + (Math.random() - 0.5) * 0.1;
    p.coordinates = { lat, lng };
    await p.save();
  }
  console.log('Updated ' + properties.length + ' properties with coordinates');
  process.exit(0);
}
updateCoords();
