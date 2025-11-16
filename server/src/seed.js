import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { DataStructure } from './models/DataStructure.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

async function run() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error(
      'MONGODB_URI is not set. Create server/.env with your connection string (local or Atlas).\n' +
        'Example: MONGODB_URI=mongodb://localhost:27017/structify'
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected for seeding');
  } catch (err) {
    console.error('Failed to connect to MongoDB.');
    console.error(String(err?.message || err));
    console.error(
      'Tips: Ensure MongoDB is running locally or use a MongoDB Atlas connection string in server/.env.'
    );
    process.exit(1);
  }

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const seedPath = path.resolve(__dirname, '../seed/data-structures.json');
  const raw = fs.readFileSync(seedPath, 'utf-8');
  const items = JSON.parse(raw);

  for (const item of items) {
    const existing = await DataStructure.findOne({ slug: item.slug });
    if (existing) {
      // update existing (merge code snippets by id if new ones appear)
      existing.name = item.name;
      existing.description = item.description;
      existing.order = item.order;
      existing.tags = item.tags;
      existing.related = item.related;
      existing.codeSnippets = item.codeSnippets; // replace for simplicity
      await existing.save();
      console.log(`Updated: ${item.slug}`);
    } else {
      await DataStructure.create(item);
      console.log(`Inserted: ${item.slug}`);
    }
  }
  console.log('Seeding complete');
  await mongoose.disconnect();
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
