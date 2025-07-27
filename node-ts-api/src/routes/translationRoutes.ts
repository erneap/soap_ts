import { Router, Request, Response } from 'express';
import { ITranslation, Translation, TranslationList } from 'soap-models/plans';
import all from '../../dist/translations.json';
import { Collection } from 'mongodb';
import { collections } from '../config/mongoconnect';
import { auth } from '../middleware/authorization.middleware';

const router = Router();

router.get("/translations", auth, async (req: Request, res: Response) => {
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
    console.log("No Translation Collection");
    res.status(404).send("Unable to find collection");
  }
});

router.get("/translation/:id", auth, async (req: Request, res: Response) => {
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
    if (results) {
      const trans = new Translation(results);
      return res.status(200).json(trans);
    } else {
      return res.status(404).send("Translation Not Found");
    }
  } else {
    console.log("No Translation Collection");
    res.status(404).send("Unable to find collection");
  }
})

export default router;