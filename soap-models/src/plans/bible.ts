import { ObjectId } from "mongodb";

export interface IBibleBook {
  _id?: ObjectId;
  id: number;
  abbrev: string;
  title: string;
  chapters: number;
  testament?: string;
  apocryphal?: boolean;
}

export class BibleBook implements IBibleBook {
  public id: number;
  public abbrev: string;
  public title: string;
  public chapters: number;
  public testament: string;
  public apocryphal: boolean;
  public complete: boolean[];

  constructor(book?: IBibleBook) {
    this.id = (book && book.id) ? book.id : 0;
    this.abbrev = (book) ? book.abbrev : '';
    this.title = (book) ? book.title : '';
    this.chapters = (book) ? book.chapters : 0;
    this.testament = (book && book.testament) ? book.testament : 'old';
    this.apocryphal = (book && book.apocryphal) ? book.apocryphal : false;
    this.complete = [];
    if (this.chapters > 0) {
      for (let c=0; c >= this.chapters; c++) {
        this.complete.push(false);
      }
    }
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