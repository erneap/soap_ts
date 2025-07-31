import { Router, Request, Response } from "express";
import { collections } from "../config/mongoconnect";
import { Collection, ObjectId } from "mongodb";
import { ISoapEntryList, NewEntryRequest, SoapEntry, SoapEntryList, UpdateEntryRequest } from 'soap-models/dist/entries';
import { IUser } from "soap-models/dist/users";

const router = Router();

router.get('/entries/year/:user/:year', async (req: Request, res: Response) => {
  const entryCol: Collection | undefined = collections.entries;
  if (entryCol) {
    const list: SoapEntry[] = [];
    const sUser = req.params.user;
    const year = Number(req.params.year);
    const query = { userID: new ObjectId(sUser), year: year };
    const iEntryList = await entryCol.findOne<ISoapEntryList>(query);
    if (iEntryList && iEntryList !== null) {
      const entryList = new SoapEntryList(iEntryList);
      entryList.entries.forEach(entry => {
        list.push(new SoapEntry(entry));
      });
      list.sort((a,b) => a.compareTo(b));
    }
    return res.status(200).json(list);
  } else {
    return res.status(404).send('No Soap Entry Collection');
  }
});

router.get('/entries/dates/:user/:start/:end', async (req: Request, res: Response) => {
  const entryCol: Collection | undefined = collections.entries;
  if (entryCol) {
    const list: SoapEntry[] = [];
    const sUser = req.params.user;    
    const sStartDate = req.params.start;
    const startDate = new Date(Date.parse(sStartDate));
    const sEndDate = req.params.end;
    let endDate = new Date();
    if (sEndDate === '') {
      endDate = new Date(Date.parse(sEndDate));
    }
    let year = startDate.getUTCFullYear();
    while (year <= endDate.getUTCFullYear()) {
      const query = { userID: new ObjectId(sUser), year: startDate.getUTCFullYear()};
      const iEntryList = await entryCol.findOne<ISoapEntryList>(query);
      if (iEntryList && iEntryList !== null) {
        const entryList = new SoapEntryList(iEntryList);
        const tlist = entryList.getEntries(startDate, endDate);
        tlist.forEach(entry => {
          list.push(new SoapEntry(entry));
        })
      }
      year++;
    }
    list.sort((a,b) => a.compareTo(b));
    return res.status(200).json(list);
  } else {
    return res.status(404).send('No Soap Entry Collection');
  }
});

router.get('/entry/:user/:date', async (req: Request, res: Response) => {
  const entryCol: Collection | undefined = collections.entries;
  if (entryCol) {
    const sUser = req.params.user;    
    const sEntryDate = req.params.date;
    const entryDate = new Date(Date.parse(sEntryDate));
    const query = { userID: new ObjectId(sUser), year: entryDate.getUTCFullYear()};
    const iEntryList = await entryCol.findOne<ISoapEntryList>(query);
    if (iEntryList && iEntryList !== null) {
      const entryList = new SoapEntryList(iEntryList);
      const entry = entryList.getEntry(entryDate);
      if (entry) {
        return res.status(200).json(entry);
      } else {
        return res.status(404).send('Soap Entry not found');
      }
    } else {
      return res.status(404).send('Entry List for user and year not found');
    }
  } else {
    return res.status(404).send('No Soap Entry Collection');
  }
});

router.post('/entry', async (req: Request, res: Response) => {
  const entryCol: Collection | undefined = collections.entries;
  const userCol: Collection | undefined = collections.users;
  if (entryCol) {
    const data = req.body as NewEntryRequest;
    const entrydate = new Date(Date.parse(data.entrydate));
    const query = { userID: new ObjectId(data.user), year: entrydate.getUTCFullYear()};
    const iEntryList = await entryCol.findOne<ISoapEntryList>(query);
    let entryList = new SoapEntryList();
    if (iEntryList && iEntryList !== null) {
      entryList = new SoapEntryList(iEntryList);
    } else {
      entryList.userID = new ObjectId(data.user);
      entryList.year = entrydate.getUTCFullYear();
      const uQuery = { _id: new ObjectId(data.user) };
      const iUser = await userCol?.findOne<IUser>(uQuery);
      if (iUser && iUser !== null) {
        entryList.lastName = iUser.lastName;
      }
      const result = await entryCol.insertOne(entryList);
      entryList._id = result.insertedId;
    }
    let entry = entryList.getEntry(entrydate);
    if (!entry) {
      entry = entryList.addEntry(entrydate);
      const lquery = { _id: entryList._id };
      await entryCol.replaceOne(lquery, entryList);
    }
    console.log(JSON.stringify(entry));
    return res.status(202).json(entry);
  } else {
    return res.status(404).send('No Soap Entry Collection');
  }
});

router.put('/entry', async (req: Request, res: Response) => {
  const entryCol: Collection | undefined = collections.entries;
  if (entryCol) {
    try {
      const data = req.body as UpdateEntryRequest;
      const entrydate = new Date(Date.parse(data.entrydate));
      const query = { userID: new ObjectId(data.user), year: entrydate.getUTCFullYear()};
      const iEntryList = await entryCol.findOne<ISoapEntryList>(query);
      if (iEntryList && iEntryList !== null) {
        const entryList = new SoapEntryList(iEntryList);
        const entry = entryList.updateEntry(entrydate, data.field, data.value);
        if (entry) {
          const lquery = { _id: entryList._id };
          await entryCol.replaceOne(lquery, entryList);
          return res.status(200).json(entry);
        } else {
          return res.status(400).send('Problem updating entry');
        }
      } else {
        return res.status(404).send('Entry List for user and year not found');
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).send(error.message);
      } else if (typeof error === "string") {
        return res.status(404).send(error);
      } else {
        console.log(error);
        return res.status(500).send(error);
      }
    }
  } else {
    return res.status(404).send('No Soap Entry Collection');
  }
});

router.delete('/entry/:user/:date', async (req: Request, res: Response) => {
  const entryCol: Collection | undefined = collections.entries;
  if (entryCol) {
    const sDate = req.params.date;
    const date = new Date(Date.parse(sDate));
    const sUser = req.params.user;
    const query = { userID: new ObjectId(sUser), year: date.getUTCFullYear()}
    const iEntryList = await entryCol.findOne<ISoapEntryList>(query);
    if (iEntryList && iEntryList !== null) {
      const entryList = new SoapEntryList(iEntryList);
      entryList.deleteEntry(date);
      const equery = { _id: entryList._id };
      if (entryList.entries.length > 0) {
        await entryCol.replaceOne(equery, entryList);
      } else {
        await entryCol.deleteOne(equery);
      }
      return res.status(200).send('Deletion completed');
    } else {
      return res.status(404).send('Entry List for user and year not found');
    }
  } else {
    return res.status(404).send('No Soap Entry Collection');
  }
});

export default router;