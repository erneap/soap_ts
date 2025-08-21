import { IParagraph, Paragraph } from "./paragraph";

export interface IPage {
  page: number;
  header: string;
  subheader: string;
  paragraphs: IParagraph[];
}

export class Page implements IPage {
  public page: number;
  public header: string;
  public subheader: string;
  public paragraphs: Paragraph[];

  constructor(page?: IPage) {
    this.page = (page) ? page.page : 0;
    this.header = (page) ? page.header : '';
    this.subheader = (page) ? page.subheader : '';
    this.paragraphs = [];
    if (page && page.paragraphs.length > 0) {
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
}
