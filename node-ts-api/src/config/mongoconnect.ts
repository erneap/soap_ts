import { MongoClient, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';



export const collections: { 
  users?: Collection, 
  plans?: Collection,
  entries?: Collection,
} = {}

export async function connectToDB() {
  dotenv.config();
  const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWD}`
    + `@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/`
    + '?authSource=scheduler&directConnection=true';
  const client = new MongoClient(uri);
  await client.connect();
  console.log('Connected to database');
  const db: Db = client.db(process.env.MONGO_DB_NAME);
  const users: Collection = db.collection("users");
  collections.users = users;
  const plans: Collection = db.collection("plans");
  collections.plans = plans;
  const entries: Collection = db.collection('entries');
  collections.entries = entries;
  console.log('Successfully connected to collections');
}