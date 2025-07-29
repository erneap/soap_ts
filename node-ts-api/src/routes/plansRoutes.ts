import { Router, Request, Response } from "express";
import { collections } from "../config/mongoconnect";
import { Collection, ObjectId } from "mongodb";
import { IPlan, NewPlanDayReadingRequest, NewPlanRequest, Plan, 
  PlanDay, PlanMonth, Reading, UpdatePlanRequest } from "soap-models/dist/plans";

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
  const data = req.body as NewPlanRequest;
  if (plansCol) {
    // first check for plan with name already present and pass back.
    const query = { name: data.name };
    const result = await plansCol.findOne<IPlan>(query);
    if (result) {
      const plan = new Plan(result);
      return res.status(200).json(plan);
    } else {
    // if not present, add new plan
      const plan = new Plan();
      plan.name = data.name;
      while (plan.months.length < data.months) {
        plan.months.push(new PlanMonth());
      }
      for (let m=0; m < plan.months.length; m++) {
        plan.months[m].month = m + 1;
      }
      const newResult = await plansCol.insertOne(plan);
      plan._id = newResult.insertedId;
      return res.status(202).json(plan);
    }
  } else {
    return res.status(404).send('No Plans Collection');
  }
});

router.post('/plan/reading', async (req: Request, res: Response) => {
  const plansCol: Collection | undefined = collections.plans;
  const data = req.body as NewPlanDayReadingRequest;
  if (plansCol) {
    const query = { _id: new ObjectId(data.id)};
    const result = await plansCol.findOne<IPlan>(query);
    if (result) {
      const plan = new Plan(result);
      let mFound = false;
      let dFound = false;
      for (let m=0; m < plan.months.length && !mFound; m++) {
        const month = plan.months[m];
        if (month.month === data.month) {
          mFound = true;
          for (let d=0; d < month.days.length &&!dFound; d++) {
            const day = month.days[d];
            if (day.dayOfMonth === data.day) {
              dFound = true;
              day.readings.sort((a,b) => a.compareTo(b));
              const reading = new Reading();
              reading.book = data.book;
              reading.chapter = data.chapter;
              reading.verseEnd = data.end;
              reading.verseStart = data.start;
              day.readings.push(reading);
              for (let r=0; r < day.readings.length; r++) {
                day.readings[r].id = r + 1;
              }
              month.days[d] = day;
            }
          }
          plan.months[m] = month;
        }
      }
      await plansCol.replaceOne(query, plan);
      return res.status(200).json(plan);
    } else {
      return res.status(404).send("Plan Not Found");
    }
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
        let mFound = false;
        plan.months.sort((a,b) => a.compareTo(b));
        for (let m=0; m < plan.months.length && !mFound; m++) {
          const month = plan.months[m];
          if (month.month === Number(data.month)) {
            mFound = true;
            if (data.day) {
              let dFound = false;
              month.days.sort((a,b) => a.compareTo(b));
              for (let d=0; d < month.days.length && !dFound; d++) {
                const day = month.days[d];
                if (day.dayOfMonth === Number(data.day)) {
                  dFound = true;
                  if (data.readingID) {
                    let rFound = false;
                    for (let r=0; r < day.readings.length && !rFound; r++) {
                      if (day.readings[r].id === Number(data.readingID)) {
                        rFound = true;
                        switch (data.field.toLowerCase()) {
                          case "book":
                            day.readings[r].book = data.value;
                          case "chapter":
                            day.readings[r].chapter = Number(data.value);
                            break;
                          case "startverse":
                          case "versestart":
                          case "start":
                            if (Number(data.value) > 0) {
                              day.readings[r].verseStart = Number(data.value);
                            } else {
                              day.readings[r].verseStart = undefined;
                            }
                            break;
                          case "endverse":
                          case "verseend":
                          case "end":
                            if (Number(data.value) > 0) {
                              day.readings[r].verseEnd = Number(data.value);
                            } else {
                              day.readings[r].verseEnd = undefined;
                            }
                            break;
                          case "move":
                            let old = day.readings[r].id;
                            day.readings.sort((a,b) => a.compareTo(b));
                            if (data.value.toLowerCase() === 'up' && r > 0) {
                              day.readings[r].id = day.readings[r-1].id;
                              day.readings[r-1].id = old;
                            } else if (data.value.toLowerCase() === 'down' && r < day.readings.length - 1) {
                              day.readings[r].id = day.readings[r+1].id;
                              day.readings[r+1].id = old;
                            }
                            day.readings.sort((a,b) => a.compareTo(b));
                        }
                      }
                    }
                  } else {
                    switch (data.field.toLowerCase()) {
                      case "readings":
                      case "setreadings":
                        const iRead = Number(data.value);
                        if (iRead < day.readings.length) {
                          while (day.readings.length > iRead) {
                            day.readings.pop();
                          }
                        } else if (iRead > day.readings.length) {
                          while (day.readings.length < iRead) {
                            day.readings.push(new Reading());
                          }
                        }
                        for (let r=0; r < day.readings.length; r++) {
                          day.readings[r].id = r + 1;
                        }
                        month.days[d] = day;
                        break;
                      case "deletereading":
                      case "delete":
                        const iReading = Number(data.value);
                        let rFound = false;
                        for (let r=0; r < day.readings.length && !rFound; r++) {
                          if (day.readings[r].id === iReading) {
                            day.readings.splice(r, 1);
                          }
                        }
                        month.days[d] = day;
                        break;
                      case "move":
                        const old = day.dayOfMonth;                        
                        if (data.value.toLowerCase() === 'up' && d > 0) {
                          month.days[d].dayOfMonth = month.days[d-1].dayOfMonth;
                          month.days[d-1].dayOfMonth = old;
                        } else if (data.value.toLowerCase() === 'down' && d < month.days.length - 1) {
                          month.days[d].dayOfMonth = month.days[d+1].dayOfMonth;
                          month.days[d+1].dayOfMonth = old;
                        }
                        month.days.sort((a,b) => a.compareTo(b));
                        break;
                    }
                  }
                  
                }
              }
            } else {
              switch (data.field.toLowerCase()) {
                case "setdays":
                case "days":
                  const idays = Number(data.value);
                  month.days.sort((a,b) => a.compareTo(b));
                  if (idays < month.days.length) {
                    while (idays < month.days.length) {
                      month.days.pop();
                    }
                  } else if (idays > month.days.length) {
                    while (month.days.length < idays) {
                      month.days.push(new PlanDay())
                    }
                  }
                  for (let d=0; d < month.days.length; d++) {
                    month.days[d].dayOfMonth = d + 1;
                  }
                  plan.months[m] = month;
                  break;
                case "move":
                  const old = plan.months[m].month;
                  if (data.value.toLowerCase() === 'up' && m > 0) {
                    plan.months[m].month = plan.months[m-1].month;
                    plan.months[m-1].month = old;
                  } else if (data.value.toLowerCase() === 'down' && m < plan.months.length - 1) {
                    plan.months[m].month = plan.months[m+1].month;
                    plan.months[m+1].month = old;
                  }
                  plan.months.sort((a,b) => a.compareTo(b));
                  break;
              }
            }
          }
        }
      } else {
        switch (data.field.toLowerCase()) {
          case "name":
            plan.name = data.value;
            break;
          case "type":
            plan.type = data.value;
            break;
          case "setmonths":
          case "months":
            const iMonths = Number(data.value);
            plan.months.sort((a,b) => a.compareTo(b));
            if (plan.months.length > iMonths) {
              while (plan.months.length > iMonths) {
                plan.months.pop();
              }
            } else if (plan.months.length < iMonths) {
              for (let i = plan.months.length; i < iMonths; i++) {
                const month = new PlanMonth();
                month.month = i;
                plan.months.push(month);
              }
            }
            for (let m = 0; m < plan.months.length; m++) {
              plan.months[m].month = m + 1;
            }
            break;
        }
      }
      await plansCol.replaceOne(query, plan);
      return res.status(200).json(plan);
    } else {
      return res.status(404).send("Plan Not Found");
    }
  } else {
    return res.status(404).send('No Plans Collection');
  }
});

router.delete('/plan/:id', async(req: Request, res: Response) => {
  const plansCol: Collection | undefined = collections.plans;
  if (plansCol) {
    const id = new ObjectId(req.params.id);
    const query = { _id: id };
    const result = await plansCol.deleteOne(query);
    return res.status(200).send('Plan Deleted');
  } else {
    return res.status(404).send('No Plans Collection');
  }
});

export default router;