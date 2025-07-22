import { Router, Request, Response } from 'express';
import { TranslationList } from 'soap-models/plans';
import all from '../../dist/translations.json';

const router = Router();

const trans = (all as TranslationList);

router.get("/translations", (req: Request, res: Response) => {
  res.status(200).json(trans);
});

export default router;