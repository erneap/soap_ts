import { ObjectId } from "mongodb";

export interface ITranslation {
  _id?: ObjectId;
  id: number;
  short: string;
  long: string;
}

export class Translation implements ITranslation {
  public id: number;
  public short: string;
  public long: string;

  constructor(trans?: ITranslation) {
    this.id = (trans && trans.id) ? trans.id : 0;
    this.short = (trans && trans.short) ? trans.short : '';
    this.long = (trans && trans.long) ? trans.long : '';
  }

  compareTo(other?: Translation): number {
    if (other) {
      return (this.id < other.id) ? -1 : 1;
    }
    return -1;
  }
}

export interface ITranslationList {
  list: ITranslation[];
}

export class TranslationList implements ITranslationList {
  public list: Translation[];

  constructor(list?: ITranslationList) {
    this.list = [];
    if (list && list.list) {
      list.list.forEach((item: ITranslation) => {
        this.list.push(new Translation(item));
      });
    }
    this.list.sort((a,b) => a.compareTo(b));
  }

  addTranslation(short: string, long: string): Translation | undefined{
    let last = 0;
    let found = false;
    for (let i=0; i < this.list.length && !found; i++) {
      if (this.list[i].short.toLowerCase() === short.toLowerCase()) {
        found = true;
      } else if (this.list[i].id > last) {
        last = this.list[i].id;
      }
    }
    if (!found) {
      const item: ITranslation = { id: last + 1, short, long}
      const translation = new Translation(item);
      this.list.push(translation);
      return translation;
    }
    return undefined;
  }
}

export interface NewTranslationRequest {
  short: string;
  long: string;
}

export interface UpdateTranslationRequest {
  id: number;
  field: string;
  value: string;
}