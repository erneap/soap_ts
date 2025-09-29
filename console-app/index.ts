import { ISoapEntryList, SoapEntryList } from 'soap-models/entries'
import { connectToDB, collections } from './config/mongoconnect';
import { Collection, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const main = async () => {
  await connectToDB();

  const entryCol: Collection | undefined = collections.entries;
  if (entryCol) {
    try {
      const query = { };
      const cursor = await entryCol.find<ISoapEntryList>(query);
      const lists = await cursor.toArray();

      lists.forEach(iList => {
        const list = new SoapEntryList(iList);
        const nQuery = { _id: new ObjectId(list.id) };
        entryCol.replaceOne(nQuery, list);
      });
      
    } catch (error) {
      console.log(error);
    }
  }
  
}

main();