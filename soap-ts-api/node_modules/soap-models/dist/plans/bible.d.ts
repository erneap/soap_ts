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
export declare class BibleBook implements IBibleBook {
    id: number;
    abbrev: string;
    title: string;
    chapters: number;
    testament: string;
    apocryphal: boolean;
    complete: boolean[];
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
