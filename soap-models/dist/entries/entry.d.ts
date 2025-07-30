import { ObjectId } from "mongodb";
export interface ISoapEntry {
    entryDate: Date;
    title: string;
    scripture: string;
    observations: string;
    application: string;
    prayer: string;
}
export declare class SoapEntry implements ISoapEntry {
    entryDate: Date;
    title: string;
    scripture: string;
    observations: string;
    application: string;
    prayer: string;
    constructor(entry?: ISoapEntry);
    setEntryDate(date: Date): void;
    getEntryDate(): Date;
    compareTo(other?: SoapEntry): number;
}
export interface ISoapEntryList {
    _id: ObjectId;
    userID?: ObjectId;
    lastName?: string;
    year: number;
    entries: ISoapEntry[];
}
export declare class SoapEntryList implements ISoapEntryList {
    _id: ObjectId;
    userID?: ObjectId;
    lastName?: string;
    year: number;
    entries: SoapEntry[];
    constructor(list?: ISoapEntryList);
    addEntry(date: Date): SoapEntry;
    getEntry(date: Date): SoapEntry | undefined;
    updateEntry(date: Date, field: string, value: string): SoapEntry | undefined;
    deleteEntry(date: Date): void;
    compareTo(other?: SoapEntryList): number;
}
export interface NewEntryRequest {
    user: string;
    entrydate: string;
}
export interface UpdateEntryRequest {
    user: string;
    entrydate: string;
    field: string;
    value: string;
}
