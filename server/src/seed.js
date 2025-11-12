import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { DataStructure } from './models/DataStructure.js';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function run() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/visualgo';
  await mongoose.connect(MONGODB_URI);
  console.log('Connected for seeding');
  // We are already inside /server as cwd, so seed directory is just 'seed'
  const seedPath = path.resolve(process.cwd(), 'seed', 'data-structures.json');
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
