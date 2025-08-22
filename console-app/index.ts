import { IPlan, ITranslation, ITranslationList, Plan, Translation, IBibleBook, BibleBook } from 'soap-models/dist/plans';
import { IUser, User } from 'soap-models/dist/users';
import { IPage, Page } from 'soap-models/dist/help';
import all from './translations.json';
import plans from './plan2.json';
import books from './bible.json';
import help from './help.json';
import { connectToDB, collections } from './config/mongoconnect';
import { Collection, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const main = async () => {
  await connectToDB();

  const userCol: Collection | undefined = collections.users;
  try {
    const query = { email: 'ernea5956@gmail.com'};
    const result = await userCol?.findOne<IUser>(query);

    if (!result) {
      const user = new User();
      user.email = 'ernea5956@gmail.com'
      user.setPassword('mko09IJNbhu8');
      user.firstName = 'Anton';
      user.middleName = 'Peter';
      user.lastName = 'Erne';
      await userCol?.insertOne(user);
    }
  } catch (error) {
    console.log(error);
  }

  const trans = (all as ITranslationList)
  const transCol: Collection | undefined = collections.translations;

  try {
    for (let i=0; i < trans.list.length; i++) {
      const t = trans.list[i];
      const query = { short: t.short };
      const result = await transCol?.findOne(query);
      if (!result) {
        await transCol?.insertOne(new Translation(t));
        console.log(`Inserted: ${t.long}`);
      }
    }
  } catch (error) {
    console.log(error);
  }

  const iPlan = (plans as IPlan);
  const plansCol: Collection | undefined = collections.plans;
  try {
    const plan = new Plan(iPlan);
    if (plan.type.toLowerCase() === 'circular') {
      plan.months[0].days.forEach((day, d) => {
        day.dayOfMonth = d + 1;
        plan.months[0].days[d] = day;
      });
    }
    const query = { name: plan.name };
    const result = (await plansCol?.findOne<IPlan>(query));
    if (!result) {
      await plansCol?.insertOne(plan);
      console.log('Plan Inserted')
    } else {
      if (result._id) {
        plan.id = result._id.toString();
      }
      await plansCol?.replaceOne(query, plan);
      console.log('Plan replaced')
    }
  } catch (error) {
    console.log(error);
  }

  const iBooks = (books as IBibleBook[]);
  const bookCol: Collection | undefined = collections.books;
  try {
    const dbBooks: BibleBook[] = [];
    const cursor = await bookCol?.find<IBibleBook>({});
    let results = await cursor?.toArray();
    if (results) {
      results.forEach(bk => {
        dbBooks.push(new BibleBook(bk));
      });
    }
    dbBooks.sort((a,b) => a.compareTo(b));
    iBooks.forEach(async(b) => {
      const dBk = dbBooks.find(x => x.abbrev === b.abbrev);
      if (dBk) {
        b.id = dBk.id;
        const query = { _id: b._id};
        await bookCol?.replaceOne(query, b);
      } else {
        const result = await bookCol?.insertOne(b);
        b._id = result?.insertedId;
        dbBooks.push(new BibleBook(b));
      }
    });
  } catch (error) {
    console.log(error);
  }

  const helpCol: Collection | undefined = collections.help;
  try {
    if (helpCol) {
      const dbPages: Page[] = [];
      const cursor = await helpCol.find<IPage>({});
      let results = await cursor.toArray();
      if (results) {
        results.forEach(pg => {
          dbPages.push(new Page(pg));
        });
      }
      dbPages.sort((a,b) => a.compareTo(b));

      const ihelp = (help as IPage[]);
      ihelp.forEach(async(ipage) => {
        const dPage = dbPages.find(x => x.page === ipage.page);
        if (dPage) {
          const query = { page: dPage?.page}
          await helpCol.replaceOne(query, ipage);
        } else {
          await helpCol.insertOne(ipage);
          dbPages.push(new Page(ipage));
        }
      });
      console.log('Help pages loaded')
    }
  } catch (error) {
    console.log(error);
  }
  
}

main();