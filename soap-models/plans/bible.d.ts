import { ObjectId } from "mongodb";
export interface IBibleBook {
    _id?: ObjectId;
    id: number;
    abbrev: string;
    title: string;
    chapters: number;
}
export declare class BibleBook implements IBibleBook {
    _id: ObjectId;
    id: number;
    abbrev: string;
    title: string;
    chapters: number;
    constructor(book?: IBibleBook);
    compareTo(other?: BibleBook): number;
}
