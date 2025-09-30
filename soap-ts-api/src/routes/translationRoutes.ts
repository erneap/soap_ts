import { Router, Request, Response } from 'express';
import { ITranslation, NewTranslationRequest, Translation, TranslationList, UpdateTranslationRequest } from 'soap-models/plans';
import { Collection, ObjectId } from 'mongodb';
import { collections } from '../config/mongoconnect';
import { auth } from '../middleware/authorization.middleware';

const router = Router();

router.get("/translations", async (req: Request, res: Response) => {
  const transCol: Collection | undefined = collections.translations;
  if (transCol) {
    const cursor = transCol.find<ITranslation>({});
    let results = await cursor.toArray();
    const list: Translation[] = []
    results.forEach(u => {
      list.push(new Translation(u));
    });
    list.sort((a,b) => a.compareTo(b));
    return res.status(200).json(list);
  } else {
    return res.status(404).send("Unable to find collection");
  }
});

router.get("/translation/:id", async (req: Request, res: Response) => {
  const transCol: Collection | undefined = collections.translations;
  const id = req.params.id;
  const numRE = new RegExp("^[0-9]+$");
  if (transCol) {
    const query = { short: id };
    let results = await transCol.findOne<ITranslation>(query);
    if (numRE.test(id)) {
      const numquery = { id: Number(id) };
      results = await transCol.findOne<ITranslation>(numquery);
    }
    if (results && results !== null) {
      const trans = new Translation(results);
      return res.status(200).json(trans);
    } else {
      return res.status(404).send("Translation Not Found");
    }
  } else {
    res.status(404).send("Unable to find collection");
  }
});

router.post("/translation", async (req: Request, res: Response) => {
  const transCol: Collection | undefined = collections.translations;
  const data = req.body as NewTranslationRequest;
  if (transCol) {
    const query = { short: data.short };
    let results = await transCol.findOne<ITranslation>(query);
    if (results && results !== null) {
      // already present, so update the long title
      results.long = data.long;
      await transCol.replaceOne(query, results);
      return res.status(200).json(results);
    } else {
      // find out the next translation id number and add
      let last = -1;
      const cursor = transCol.find<ITranslation>({});
      let list = await cursor.toArray();
      list.forEach(u => {
        if (last < u.id) {
          last = u.id;
        }
      });
      const trans = new Translation();
      trans.id = last + 1;
      trans.short = data.short;
      trans.long = data.long;
      const answer = await transCol.insertOne(trans);
      return res.status(201).json(trans);
    }
  } else {
    return res.status(404).send("Unable to find collection");
  }
});

router.put("/translation", async (req: Request, res: Response) => {
  const transCol: Collection | undefined = collections.translations;
  const data = req.body as UpdateTranslationRequest;
  if (transCol) {
    const query = { id: data.id };
    let results = await transCol.findOne<ITranslation>(query);
    if (results) {
      switch (data.field.toLowerCase()) {
        case "short":
          results.short = data.value;
          break;
        case "long":
          results.long = data.value;
          break;
      }
      await transCol.replaceOne(query, results);
      return res.status(200).json(results);
    } else {
      return res.status(404).send("Translation Not Found");
    }
  } else {
    return res.status(404).send("Unable to find collection");
  }
});

router.delete("/translation/:id", async (req: Request, res: Response) => {
  const transCol: Collection | undefined = collections.translations;
  const id = req.params.id;
  const numRE = new RegExp("^[0-9]+$");
  if (transCol) {
    let num = 0
    if (numRE.test(id)) {
      const numquery = { id: Number(id) };
      const result = await transCol.deleteOne(numquery);
      num = result.deletedCount
    } else {
      const query = { _id: new ObjectId(id) };
      const result = await transCol.deleteOne(query);
      num = result.deletedCount;
    }
    if (num > 0) {
      return res.status(200).send('Translation Deleted')
    } else {
      return res.status(202).send('Translation Not Found');
    }
  } else {
    return res.status(404).send("Unable to find collection");
  }

});

export default router;