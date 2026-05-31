import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const unsplash = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=2000`;

const VILLA_IMAGES = [
  unsplash('photo-1580587771525-78b9dba3b914'),
  unsplash('photo-1613490493576-7fde63acd811'),
  unsplash('photo-1531971589569-0d9370cbe1e5'),
  unsplash('photo-1613977257365-aaae5a9817ff'),
  unsplash('photo-1512917774080-9991f1c4c750'),
  unsplash('photo-1505843513577-22bb7d21e455'),
  unsplash('photo-1613977257363-707ba9348227'),
  unsplash('photo-1582268611958-ebfd161ef9cf'),
  unsplash('photo-1600596542815-ffad4c1539a9'),
  unsplash('photo-1613977257592-4871e5fcd7c4'),
  unsplash('photo-1593714604578-d9e41b00c6c6'),
  unsplash('photo-1591474200742-8e512e6f98f8'),
  unsplash('photo-1564013799919-ab600027ffc6'),
  unsplash('photo-1706808849780-7a04fbac83ef'),
  unsplash('photo-1600607687939-ce8a6c25118c'),
  unsplash('photo-1600047509807-ba8f99d2cdde'),
  unsplash('photo-1600566752355-35792bedcfea'),
  unsplash('photo-1600566753190-17f0baa2a6c3'),
  unsplash('photo-1600573472550-8090b5e0745e'),
  unsplash('photo-1600585154340-be6161a56a0c'),
];

const INTERIOR_IMAGES = [
  unsplash('photo-1564078516393-cf04bd966897'),
  unsplash('photo-1630587148265-761cbd139043'),
  unsplash('photo-1599696848652-f0ff23bc911f'),
  unsplash('photo-1581784878214-8d5596b98a01'),
  unsplash('photo-1613545325278-f24b0cae1224'),
  unsplash('photo-1578683010236-d716f9a3f461'),
  unsplash('photo-1562438668-bcf0ca6578f0'),
  unsplash('photo-1581783458534-001a466b5487'),
  unsplash('photo-1513694203232-719a280e022f'),
  unsplash('photo-1600607687920-4e2a09cf159d'),
];

const getImagesForProperty = (property, index) => {
  return [
    VILLA_IMAGES[index % VILLA_IMAGES.length],
    VILLA_IMAGES[(index + 7) % VILLA_IMAGES.length],
    VILLA_IMAGES[(index + 13) % VILLA_IMAGES.length],
    INTERIOR_IMAGES[index % INTERIOR_IMAGES.length],
    INTERIOR_IMAGES[(index + 4) % INTERIOR_IMAGES.length],
  ];
};

const fixImages = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing in server/.env');
  }

  await mongoose.connect(process.env.MONGO_URI);
  const Property = mongoose.model(
    'Property',
    new mongoose.Schema({ images: [String] }, { strict: false })
  );

  const properties = await Property.find({}).sort({ createdAt: 1, _id: 1 });

  const updates = properties.map((property, index) => ({
    updateOne: {
      filter: { _id: property._id },
      update: { $set: { images: getImagesForProperty(property, index) } },
    },
  }));

  if (updates.length > 0) {
    await Property.bulkWrite(updates);
  }

  console.log(`Updated ${properties.length} properties with varied image galleries`);
  await mongoose.disconnect();
};

fixImages()
  .then(() => process.exit(0))
  .catch(async (error) => {
    console.error(error);
    await mongoose.disconnect();
    process.exit(1);
  });
