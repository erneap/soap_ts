import { Router, Request, Response } from "express";
import { auth } from "../middleware/authorization.middleware";
import { collections } from "../config/mongoconnect";
import { Collection, ObjectId } from "mongodb";
import { IPlan, Plan, UpdatePlanRequest } from "soap-models/dist/plans";

const router = Router();

router.get('/plans', async (req: Request, res: Response) => {
  const plansCol: Collection | undefined = collections.plans;
  if (plansCol) {
    const cursor = await plansCol.find<IPlan>({});
    const plans = await cursor.toArray();
    const list: Plan[] = [];
    plans.forEach(p => {
      list.push(new Plan(p));
    }); 
    list.sort((a,b) => a.compareTo(b));
    return res.status(200).json(list);
  } else {
    return res.status(404).send('No Plans Collection');
  }
});

router.get('/plan/:id', async (req: Request, res: Response) => {
  const plansCol: Collection | undefined = collections.plans;
  if (plansCol) {
    const id = new ObjectId(req.params.id);
    const query = { _id: id };
    const result = await plansCol.findOne<IPlan>(query);
    if (result) {
      const plan = new Plan(result);
      return res.status(200).json(plan);
    } else {
      res.status(404).send('Plan Not Found');
    }
  } else {
    return res.status(404).send('No Plans Collection');
  }
});

router.post('/plan/newplan', async (req: Request, res: Response) => {
  const plansCol: Collection | undefined = collections.plans;
  if (plansCol) {

  } else {
    return res.status(404).send('No Plans Collection');
  }
});

router.post('/plan/reading', async (req: Request, res: Response) => {
  const plansCol: Collection | undefined = collections.plans;
  if (plansCol) {

  } else {
    return res.status(404).send('No Plans Collection');
  }
});

router.put('/plan', async (req: Request, res: Response) => {
  const plansCol: Collection | undefined = collections.plans;
  const data = req.body as UpdatePlanRequest;
  if (plansCol) {
    const query = { _id: new ObjectId(data.id)};
    const result = await plansCol.findOne<IPlan>(query);
    if (result) {
      const plan = new Plan(result);
      if (data.month) {

      } else {
        switch (data.field.toLowerCase()) {

        }
      }
    }
  } else {
    return res.status(404).send('No Plans Collection');
  }
});

export default router;