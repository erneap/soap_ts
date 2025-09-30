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
      const query = { userID: '688880632b30fd51bd570215', year: 2025 };
      const iList = await entryCol.findOne<ISoapEntryList>(query);
      let list = new SoapEntryList();
      if (iList && iList !== null) {
        list = new SoapEntryList(iList);
      }
      console.log(list.id);
    } catch (error) {
      console.log(error);
    }
  }
  
}

main();