import { Router, Request, Response } from "express";
import { collections } from "../config/mongoconnect";
import { Collection, ObjectId } from "mongodb";
import { NewEntryRequest } from 'soap-models/dist/entries';

const router = Router();

router.get('/entries/year/:user/:year', async (req: Request, res: Response) => {
  const entryCol: Collection | undefined = collections.entries;
  if (entryCol) {

  } else {
    return res.status(404).send('No Soap Entry Collection');
  }
});

router.get('/entries/dates/:user/:start/:end', async (req: Request, res: Response) => {
  const entryCol: Collection | undefined = collections.entries;
  if (entryCol) {

  } else {
    return res.status(404).send('No Soap Entry Collection');
  }
});

router.get('/entry/:user/:date', async (req: Request, res: Response) => {
  const entryCol: Collection | undefined = collections.entries;
  if (entryCol) {

  } else {
    return res.status(404).send('No Soap Entry Collection');
  }
});

router.post('/entry', async (req: Request, res: Response) => {
  const entryCol: Collection | undefined = collections.entries;
  if (entryCol) {
    const data = req.body as NewEntryRequest;

  } else {
    return res.status(404).send('No Soap Entry Collection');
  }
});

router.put('/entry', async (req: Request, res: Response) => {
  const entryCol: Collection | undefined = collections.entries;
  if (entryCol) {

  } else {
    return res.status(404).send('No Soap Entry Collection');
  }
});

router.delete('/entry/:user/:date', async (req: Request, res: Response) => {
  const entryCol: Collection | undefined = collections.entries;
  if (entryCol) {

  } else {
    return res.status(404).send('No Soap Entry Collection');
  }
});

export default router;