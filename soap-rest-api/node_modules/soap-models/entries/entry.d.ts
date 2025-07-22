export declare class SoapEntry {
    entryDate: Date;
    title: string;
    scripture: string;
    observations: string;
    application: string;
    prayer: string;
    constructor(entryDate: Date, title?: string, scripture?: string, observations?: string, application?: string, prayer?: string);
    setEntryDate(date: Date): void;
    getEntryDate(): Date;
    compareTo(other?: SoapEntry): number;
}
