export interface ISoapEntry {
    entryDate: Date;
    title: string;
    scripture: string;
    observations: string;
    application: string;
    prayer: string;
    read?: boolean;
}
export declare class SoapEntry implements ISoapEntry {
    entryDate: Date;
    title: string;
    scripture: string;
    observations: string;
    application: string;
    prayer: string;
    read: boolean;
    constructor(other?: ISoapEntry);
    compareTo(other?: SoapEntry): number;
    useEntry(date: Date): boolean;
}
