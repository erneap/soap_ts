import { ObjectId } from "mongodb";

export interface IBibleBook {
  _id?: ObjectId;
  id: number;
  abbrev: string;
  title: string;
  chapters: number;
}

export class BibleBook implements IBibleBook {
  public _id: ObjectId;
  public id: number;
  public abbrev: string;
  public title: string;
  public chapters: number;

  constructor(book?: IBibleBook) {
    this._id = (book && book._id) ? new ObjectId(book._id) : new ObjectId();
    this.id = (book && book.id) ? book.id : 0;
    this.abbrev = (book) ? book.abbrev : '';
    this.title = (book) ? book.title : '';
    this.chapters = (book) ? book.chapters : 0;
  }

  compareTo(other?: BibleBook): number {
    if (other) {
      return (this.id < other.id) ? -1 : 1;
    }
    return -1;
  }
}