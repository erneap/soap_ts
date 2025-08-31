import { ObjectId } from "mongodb";
import { IParagraph, Paragraph } from "./paragraph";

export interface IPage {
  _id?: ObjectId;
  id?: string;
  page: number;
  permission?: number;
  header: string;
  subheader: string;
  paragraphs?: IParagraph[];
}

export class Page implements IPage {
  public id: string;
  public page: number;
  public permission: number;
  public header: string;
  public subheader: string;
  public paragraphs: Paragraph[];

  constructor(page?: IPage) {
    this.id = (page && page.id) ? page.id : '';
    if (this.id === '' && page && page._id) {
      this.id = page._id.toString();
    }
    this.page = (page) ? page.page : 0;
    this.permission = (page && page.permission) ? page.permission : 0;
    this.header = (page) ? page.header : '';
    this.subheader = (page) ? page.subheader : '';
    this.paragraphs = [];
    if (page && page.paragraphs && page.paragraphs.length > 0) {
      page.paragraphs.forEach(para => {
        this.paragraphs.push(new Paragraph(para));
      });
      this.paragraphs.sort((a,b) => a.compareTo(b));
    }
  }

  compareTo(other?: Page): number {
    if (other) {
      return (this.page < other.page) ? -1 : 1;
    }
    return -1;
  }

  hasPermission(level: number): boolean {
    return ((this.permission & level) === level);
  }
}
