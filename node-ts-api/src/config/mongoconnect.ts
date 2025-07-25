import { MongoClient, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';



export const collections: { 
  users?: Collection, 
  plans?: Collection,
  entries?: Collection,
} = {}

export async function connectToDB() {
  dotenv.config();
  const uri = process.env.MONGO_URI;
  console.log(uri);
  if (uri) {
    try {
      const client = new MongoClient(uri);
      await client.connect();
      console.log('Connected to database');
      const db: Db = client.db(process.env.MONGO_DB_NAME);
      let users: Collection = db.collection("users");
      if (!users) {
        users = await db.createCollection("users");
      }
      collections.users = users;
      let plans: Collection = db.collection("plans");
      if (!plans) {
        plans = await db.createCollection("plans");
      }
      collections.plans = plans;
      let entries: Collection = db.collection('entries');
      if (!entries) {
        entries = await db.createCollection("entries");
      }
      collections.entries = entries;
      console.log('Successfully connected to collections');
    } catch (error) {
      console.log(error);
    }
  }
}