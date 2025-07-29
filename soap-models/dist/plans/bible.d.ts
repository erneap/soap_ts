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
