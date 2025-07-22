export interface ITranslation {
  id: number;
  short: string;
  long: string;
}

export class Translation implements ITranslation {
  public id: number;
  public short: string;
  public long: string;

  constructor(id?: number, short?: string, long?: string) {
    this.id = (id) ? id : 0;
    this.short = (short) ? short : '';
    this.long = (long) ? long : '';
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

  constructor(list?: Translation[]) {
    this.list = [];
    if (list) {
      list.forEach((item: Translation) => {
        this.list.push(new Translation(item.id, item.short, item.long));
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
      const translation = new Translation(last + 1, short, long);
      this.list.push(translation);
      return translation;
    }
    return undefined;
  }
}