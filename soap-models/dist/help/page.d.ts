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
export declare class Page implements IPage {
    id: string;
    page: number;
    permission: number;
    header: string;
    subheader: string;
    paragraphs: Paragraph[];
    constructor(page?: IPage);
    compareTo(other?: Page): number;
    hasPermission(level: number): boolean;
}
