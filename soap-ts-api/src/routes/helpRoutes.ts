import { Router, Request, Response } from "express";
import { Collection } from "mongodb";
import { collections } from "../config/mongoconnect";
import { IPage, Page } from 'soap-models/dist/help';

const router = Router();

router.get('/help', async (req: Request, res: Response) => {
  const helpCol: Collection | undefined = collections.help;
  if (helpCol) {
    const cursor = await helpCol.find<IPage>({});
    const pages = await cursor.toArray();
    const list: Page[] = [];
    pages.forEach(p => {
      list.push(new Page(p));
    }); 
    list.sort((a,b) => a.compareTo(b));
    return res.status(200).json(list);
  } else {
    return res.status(404).send('No Help Collection');
  }
});

export default router;