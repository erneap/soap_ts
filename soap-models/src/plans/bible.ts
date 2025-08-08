import { ObjectId } from "mongodb";

export interface IBibleBook {
  _id?: ObjectId;
  id: number;
  abbrev: string;
  title: string;
  chapters: number;
}

export class BibleBook implements IBibleBook {
  public id: number;
  public abbrev: string;
  public title: string;
  public chapters: number;

  constructor(book?: IBibleBook) {
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

export interface NewBibleBookRequest {
  abbrev: string;
  title: string;
  chapters: number;
}

export interface UpdateBibleBookRequest {
  id: string;
  field: string;
  value: string;
}