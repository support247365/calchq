/**
 * Load ZIP code data into the database in batches
 * Run with: node load_zipcodes.mjs
 */
import { readFileSync } from 'fs';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { zipCodes } from './drizzle/schema.ts';

// Load environment
import { config } from 'dotenv';
config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

console.log('Connecting to database...');
const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

console.log('Loading ZIP code data...');
const data = JSON.parse(readFileSync('/home/ubuntu/zipcode_data.json', 'utf8'));
console.log(`Loaded ${data.length} ZIP codes from file`);

// Check if already loaded
const existing = await db.select({ zip: zipCodes.zip }).from(zipCodes).limit(1);
if (existing.length > 0) {
  console.log('ZIP codes already loaded, skipping...');
  await connection.end();
  process.exit(0);
}

// Insert in batches of 500
const BATCH_SIZE = 500;
let inserted = 0;

for (let i = 0; i < data.length; i += BATCH_SIZE) {
  const batch = data.slice(i, i + BATCH_SIZE).map(item => ({
    zip: item.zip,
    city: item.city,
    state: item.state,
    stateName: item.state_name,
    county: item.county || null,
    lat: String(item.lat),
    lng: String(item.lng),
    timezone: item.timezone,
    utcOffset: item.utc_offset,
    medianIncome: item.median_income,
    medianHomeValue: item.median_home_value,
  }));

  try {
    await db.insert(zipCodes).values(batch).onDuplicateKeyUpdate({ set: { city: batch[0].city } });
    inserted += batch.length;
    if (inserted % 5000 === 0 || inserted >= data.length) {
      console.log(`Inserted ${inserted}/${data.length} ZIP codes...`);
    }
  } catch (err) {
    console.error(`Batch error at offset ${i}:`, err.message);
  }
}

console.log(`\nDone! Inserted ${inserted} ZIP codes total.`);
await connection.end();
