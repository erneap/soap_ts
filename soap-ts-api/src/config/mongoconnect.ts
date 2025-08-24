import { MongoClient, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';

export const collections: { 
  users?: Collection, 
  plans?: Collection,
  entries?: Collection,
  translations?: Collection,
  books?: Collection,
  help?: Collection
} = {}

export async function connectToDB() {
  dotenv.config();
  const uri = process.env.MONGO_URI;
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
      let translations: Collection = db.collection("translations");
      if (!translations) {
        translations = await db.createCollection("translations");
      }
      collections.translations = translations;
      let books = await db.collection('biblebooks');
      if (!books) {
        books = await db.createCollection('biblebooks');
      }
      collections.books = books;
      let help = await db.collection('help');
      if (!help) {
        help = await db.createCollection('help');
      }
      collections.help = help;
      console.log('Successfully connected to collections');
    } catch (error) {
      console.log(error);
    }
  }
}