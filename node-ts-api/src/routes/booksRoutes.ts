import { Router, Request, Response } from "express";
import { collections } from "../config/mongoconnect";
import { Collection, ObjectId } from "mongodb";
import { BibleBook, IBibleBook } from "soap-models/dist/plans";

const router = Router();

router.get('/books', async (req: Request, res: Response) => {
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

router.get('/book/:id', async (req: Request, res: Response) => {
  const booksCol: Collection | undefined = collections.books;
  if (booksCol) {

  } else {
    return res.status(404).send('No Bible Books Collection');
  }
});

router.post('/book', async (req: Request, res: Response) => {
  const booksCol: Collection | undefined = collections.books;
  if (booksCol) {

  } else {
    return res.status(404).send('No Bible Books Collection');
  }
});

router.put('/book', async (req: Request, res: Response) => {
  const booksCol: Collection | undefined = collections.books;
  if (booksCol) {

  } else {
    return res.status(404).send('No Bible Books Collection');
  }
});

router.delete('/book', async (req: Request, res: Response) => {
  const booksCol: Collection | undefined = collections.books;
  if (booksCol) {

  } else {
    return res.status(404).send('No Bible Books Collection');
  }
});

export default router;