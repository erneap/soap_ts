import { Router, Request, Response } from "express";
import { auth } from "../middleware/authorization.middleware";
import { collections } from "../config/mongoconnect";
import { Collection, ObjectId } from "mongodb";
import { IPlan, Plan } from "soap-models/plans";

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

export default router;