import { Router, Request, Response } from "express";
import { Collection } from "mongodb";
import { collections } from "../config/mongoconnect";
import { IPage, Page } from 'soap-models/dist/help';
import { Permissions } from "soap-models";

const router = Router();

router.get('/help/:level', async (req: Request, res: Response) => {
  const helpCol: Collection | undefined = collections.help;
  if (helpCol) {
    let lvl = req.params['level'];
    let level = 0;
    if (lvl) {
      level = Number(lvl);
    }
    const cursor = await helpCol.find<IPage>({});
    const pages = await cursor.toArray();
    const list: Page[] = [];
    pages.forEach(p => {
      const page = new Page(p);
      if ((level === 0 && !page.hasPermission(Permissions.site) 
        && !page.hasPermission(Permissions.team) 
        && !page.hasPermission(Permissions.admin))
        || (level === 1 && !page.hasPermission(Permissions.team)
        && !page.hasPermission(Permissions.admin))
        || (level === 2 && !page.hasPermission(Permissions.admin))
        || level === 4) {
        list.push(page);
      }
    }); 
    list.sort((a,b) => a.compareTo(b));
    return res.status(200).json(list);
  } else {
    return res.status(404).send('No Help Collection');
  }
});

export default router;