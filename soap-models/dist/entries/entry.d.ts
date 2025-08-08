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
    constructor(other?: ISoapEntry);
    compareTo(other?: SoapEntry): number;
    useEntry(date: Date): boolean;
}
