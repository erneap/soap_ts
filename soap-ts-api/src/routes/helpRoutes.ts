import { Router, Request, Response } from "express";
import { Collection, ObjectId } from "mongodb";
import { collections } from "../config/mongoconnect";
import { IBullet, Graphic, HelpPageUpdateRequest, IPage, Page, Bullet, Paragraph } from 'soap-models/help';
import { Permissions } from "soap-models";
import { auth } from "../middleware/authorization.middleware";

const router = Router();

router.get('/help', async (req: Request, res: Response) => {
  const helpCol: Collection | undefined = collections.help;
  if (helpCol) {
    let level = 0;
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

router.post('/help', auth, async (req: Request, res: Response) => {
  const helpCol: Collection | undefined = collections.help;
  if (helpCol) {
    const cursor = await helpCol.find<IPage>({});
    const pages = await cursor.toArray();

    // get the highest page number and create a new page with no title or 
    // any other data, with a page number one higher than last.
    let max = 0;
    pages.forEach(p => {
      if (p.page > max) {
        max = p.page;
      }
    });
    const newpage = new Page({
      page: max + 1,
      header: '',
      subheader: '',
      paragraphs: []
    });
    const add = await helpCol.insertOne(newpage);
    newpage.id = add.insertedId.toString();

    return res.status(201).json(newpage);
  } else {
    return res.status(404).send('No Help Collection');
  }
});

router.post('/help/graphic', auth, async (req: Request, res: Response) => {
  const helpCol: Collection | undefined = collections.help;
  if (helpCol) {
    const update = req.body as HelpPageUpdateRequest;

    const query = {_id: new ObjectId(update.pageid)};

    const ipage = await helpCol.findOne<IPage>(query);
    let page: Page = new Page();

    if (ipage) {
      ipage.paragraphs!.forEach(para => {
        if (para.id === update.paragraphid!) {
          let max = 0;
          if (para.graphics && para.graphics.length) {
            para.graphics.forEach(image => {
              if (image.id > max) {
                max = image.id;
              }
            })
          }
          if (!para.graphics) {
            para.graphics = [];
          }
          para.graphics.push(new Graphic({
            id: max + 1,
            mimetype: update.value,
            caption: update.field,
            filedata: update.filedata!
          }));
        }
      });
      page = new Page(ipage);
    }
    await helpCol.replaceOne(query, page);

    return res.status(200).json(page);
  } else {
    return res.status(404).send('No Help Collection');
  }
});

router.put('/help', auth, async (req: Request, res: Response) => {
  const helpCol: Collection | undefined = collections.help;
  if (helpCol) {
    const update = req.body as HelpPageUpdateRequest;

    const query = {_id: new ObjectId(update.pageid)};

    const ipage = await helpCol.findOne<IPage>(query);
    let page = new Page();

    if (ipage) {
      if (update.paragraphid) {
        let pfound = -1;
        ipage.paragraphs!.forEach((para, p) => {
          if (para.id === update.paragraphid) {
            if (update.bulletid) {
              if (para.bullets) {
                let found = -1;
                para.bullets.forEach((bullet, b) => {
                  if (bullet.id === update.bulletid) {
                    if (update.field.toLowerCase() === 'delete') {
                      found = b;
                    } else {
                      bullet.text = update.value;
                      para.bullets![b] = bullet;
                    }
                  }
                });
                if (found >= 0) {
                  para.bullets.splice(found, 1);
                }
              }
            } else if (update.graphicid) {
              if (para.graphics) {
                let found = -1;
                para.graphics.forEach((graph, g) => {
                  if (graph.id === update.graphicid) {
                    if (update.field.toLowerCase() === 'delete') {
                      found = g;
                    } else {
                      graph.caption = update.value;
                      para.graphics![g] = graph;
                    }
                  }
                });
                if (found >= 0) {
                  para.graphics.splice(found, 1);
                }
              }
            } else {
              switch (update.field.toLowerCase()) {
                case "title":
                  para.title = update.value;
                  break;
                case "text":
                  const textArray: string[] = [];
                  let start = 0;
                  while (start < update.value.length) {
                    const s = update.value.substring(start, start + 80);
                    textArray.push(s);
                    start += 80;
                  }
                  para.text = textArray;
                  break;
                case "addbullet":
                  if (!para.bullets) {
                    para.bullets = [];
                  }
                  let max = 0;
                  para.bullets.forEach(bullet => {
                    if (bullet.id > max) {
                      max = bullet.id;
                    }
                  });
                  para.bullets.push(new Bullet({
                    id: max + 1,
                    text: update.value
                  }));
                  break;
                case "delete":
                  pfound = p;
              }
            }
            ipage.paragraphs![p] = para;
          }
        });
        if (pfound >= 0) {
          if (ipage.paragraphs && ipage.paragraphs.length > 0) {
            ipage.paragraphs.splice(pfound, 1);
          }
        }
      } else {
        switch (update.field.toLowerCase()) {
          case "page":
            ipage.page = Number(update.value);
            break;
          case "header":
            ipage.header = update.value;
            break;
          case "subheader":
            ipage.subheader = update.value;
            break;
          case "permission":
          case "admin":
            ipage.permission = Number(update.value);
            break;
          case "add":
          case "addparagraph":
            let max = 0;
            if (ipage.paragraphs && ipage.paragraphs.length > 0) {
              ipage.paragraphs!.forEach(para => {
                if (para.id > max) {
                  max = para.id;
                }
              });
            } else if (!ipage.paragraphs) {
              ipage.paragraphs = [];
            }
            ipage.paragraphs.push(new Paragraph({
              id: max + 1,
              title: '',
              text: []
            }));
            break;
        }
      }
      page = new Page(ipage);
    }
    await helpCol.replaceOne(query, page);

    return res.status(200).json(page);
  } else {
    return res.status(404).send('No Help Collection');
  }
});

router.delete('/help/:id', auth, async (req: Request, res: Response) => {
  const helpCol: Collection | undefined = collections.help;
  if (helpCol) {
    const id = new ObjectId(req.params.id);
    const query = { _id: id };

    await helpCol.deleteOne(query);

    return res.status(200).json('{"message": "Deleted"}');
  } else {
    return res.status(404).send('No Help Collection');
  }
});

export default router;