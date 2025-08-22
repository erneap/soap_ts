import { IParagraph, Paragraph } from "./paragraph";
export interface IPage {
    page: number;
    header: string;
    subheader: string;
    paragraphs: IParagraph[];
}
export declare class Page implements IPage {
    page: number;
    header: string;
    subheader: string;
    paragraphs: Paragraph[];
    constructor(page?: IPage);
    compareTo(other?: Page): number;
}
