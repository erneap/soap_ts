import { ObjectId } from "mongodb";
import { ISoapEntry, SoapEntry } from "./entry";
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
    getEntries(start: Date, end: Date): SoapEntry[];
    compareTo(other?: SoapEntryList): number;
}
