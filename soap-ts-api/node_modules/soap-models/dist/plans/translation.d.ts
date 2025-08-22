import { ObjectId } from "mongodb";
export interface ITranslation {
    _id?: ObjectId;
    id: number;
    short: string;
    long: string;
}
export declare class Translation implements ITranslation {
    id: number;
    short: string;
    long: string;
    constructor(trans?: ITranslation);
    compareTo(other?: Translation): number;
}
export interface ITranslationList {
    list: ITranslation[];
}
export declare class TranslationList implements ITranslationList {
    list: Translation[];
    constructor(list?: ITranslationList);
    addTranslation(short: string, long: string): Translation | undefined;
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
