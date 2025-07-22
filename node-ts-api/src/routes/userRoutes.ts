import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { User } from 'soap-models/users';

const router = Router();

if (process.env.MONGO_USER === undefined) {
  dotenv.config();
}

const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWD}`
  + `@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/`
  + '?authSource=scheduler&directConnection=true';

const client = new MongoClient(uri);
client.connect();

// CRUD Functions 

// ******* Retrieve All Users ********
router.get('/users', async (req: Request, res: Response) => {
  const cursor = client.db('soap').collection<User>('users').find<User>({})
  let results = (await cursor.toArray()).sort((a,b) => a.compareTo(b));
  return res.status(200).json(results);
});