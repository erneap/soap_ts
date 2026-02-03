import { Router, Request, Response } from "express";
import { collections } from "../config/mongoconnect";
import { Collection, ObjectId } from "mongodb";
import { BibleBook, IBibleBook, NewBibleBookRequest, UpdateBibleBookRequest } from "soap-models/plans";
import { auth } from "../middleware/authorization.middleware";

const router = Router();

router.get('/books', auth, async (req: Request, res: Response) => {
  const booksCol: Collection | undefined = collections.books;
  if (booksCol) {
      const cursor = await booksCol.find<IBibleBook>({});
      const books = await cursor.toArray();
      const list: BibleBook[] = [];
      books.forEach(b => {
        list.push(new BibleBook(b));
      }); 
      list.sort((a,b) => a.compareTo(b));
      return res.status(200).json(list);
  } else {
    return res.status(404).send('No Bible Books Collection');
  }
});

router.get('/book/:id', auth, async (req: Request, res: Response) => {
  const booksCol: Collection | undefined = collections.books;
  if (booksCol) {
    const id = req.params.id as string;
    const query = { _id: new ObjectId(id) };
    const ibook = await booksCol.findOne<IBibleBook>(query);
    if (ibook && ibook !== null) {
      const book = new BibleBook(ibook);
      return res.status(200).json(book);
    } else {
      return res.status(404).send('Bible Book not found');
    }
  } else {
    return res.status(404).send('No Bible Books Collection');
  }
});

router.post('/book', auth, async (req: Request, res: Response) => {
  const booksCol: Collection | undefined = collections.books;
  if (booksCol) {
    const data = req.body as NewBibleBookRequest;

    // check to see if book is already present
    const bQuery = { title: data.title };
    const iBook = await booksCol.findOne<IBibleBook>(bQuery);
    if (iBook && iBook !== null) {
      return res.status(403).send('Duplicate title attempted');
    } else {
      const cursor = await booksCol.find<IBibleBook>({});
      const books = await cursor.toArray();
      const list: BibleBook[] = [];
      books.forEach(b => {
        list.push(new BibleBook(b));
      }); 
      list.sort((a,b) => a.compareTo(b));
      const newBook = new BibleBook();
      newBook.id = list[list.length - 1].id + 1;
      newBook.abbrev = data.abbrev;
      newBook.title = data.title;
      newBook.chapters = data.chapters;
      const result = await booksCol.insertOne(newBook);
      if (result && result.insertedId) {
        return res.status(201).json(newBook);
      } else {
        return res.status(401).send('New Bible Book not created');
      }
    }
  } else {
    return res.status(404).send('No Bible Books Collection');
  }
});

router.put('/book', auth, async (req: Request, res: Response) => {
  const booksCol: Collection | undefined = collections.books;
  if (booksCol) {
    const data = req.body as UpdateBibleBookRequest;
    const query = { _id: new ObjectId(data.id) };
    const ibook = await booksCol.findOne<IBibleBook>(query);
    if (ibook && ibook !== null) {
      console.log(data.field);
      switch (data.field.toLowerCase()) {
        case "abbrev":
        case "abbreviation":
        case "code": 
          ibook.abbrev = data.value;
          break;
        case "title":
          ibook.title = data.value;
          break;
        case "chapters":
          ibook.chapters = Number(data.value);
          break;
        case "move":
          const cursor = await booksCol.find<IBibleBook>({});
          const books = await cursor.toArray();
          const list: IBibleBook[] = [];
          books.forEach(b => {
            list.push(b);
          }); 
          list.sort((a,b) => (a.id < b.id) ? -1 : 1);

          let bFound = false;
          for (let i=0; i < list.length && !bFound; i++) {
            if (ibook.id === list[i].id) {
              bFound = true;
              const old = list[i].id;
              if (i > 0 && data.value.toLowerCase().substring(0,2) === 'up') {
                const other = list[i-1];
                ibook.id = other.id;
                other.id = old;
                const tquery = { _id: other._id };
                await booksCol.replaceOne(tquery, other);
              } else if (i < list.length -1 && data.value.toLowerCase().substring(0,2) === 'do') {
                const other = list[i+1];
                ibook.id = other.id;
                other.id = old;
                const tquery = { _id: other._id };
                await booksCol.replaceOne(tquery, other);
              }
            }
          }
          break;
      }
      await booksCol.replaceOne(query, ibook);
      return res.status(200).json(ibook);
    } else {
      return res.status(404).send("Bible Book not found");
    }
  } else {
    return res.status(404).send('No Bible Books Collection');
  }
});

router.delete('/book/:id', auth, async (req: Request, res: Response) => {
  const booksCol: Collection | undefined = collections.books;
  if (booksCol) {
    // with a deletion, first we delete the requested book,
    // then we pull all the other books into a list, sort them,
    // and reapply the id (sort value) to each remaining book in
    // order and update the database for each.
    const id = req.params.id;
    const query = { id: Number(id) };
    const result = await booksCol.deleteOne(query);
    if (result.deletedCount > 0) {
      const cursor = await booksCol.find<IBibleBook>({});
      const books = await cursor.toArray();
      const list: IBibleBook[] = [];
      books.forEach(b => {
        list.push(b);
      }); 
      list.sort((a,b) => (a.id < b.id) ? -1 : 1);

      for (let i=0; i < list.length; i++) {
        list[i].id = i + 1;
        const tquery = { _id: list[i]._id };
        await booksCol.replaceOne(tquery, list[i]);
      }
      return res.status(200).send('Deletion completed');
    } else {
      return res.status(404).send('Bible book not found');
    }
  } else {
    return res.status(404).send('No Bible Books Collection');
  }
});

export default router;