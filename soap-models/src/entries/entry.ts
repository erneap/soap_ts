export interface ISoapEntry {
    entryDate: Date;
    title: string;
    scripture: string;
    observations: string;
    application: string;
    prayer: string;
}

export class SoapEntry implements ISoapEntry {
    public entryDate: Date;
    public title: string;
    public scripture: string;
    public observations: string;
    public application: string;
    public prayer: string;

    constructor(other?: ISoapEntry) {
        this.entryDate = (other) ? new Date(other.entryDate) : new Date();
        this.title = (other) ? other.title : '';
        this.scripture = (other) ? other.scripture : '';
        this.observations = (other) ? other.observations : '';
        this.application = (other) ? other.application : '';
        this.prayer = (other) ? other.prayer : '';
    }

    compareTo(other?: SoapEntry): number {
        if (other) {
            return (this.entryDate.getTime() < other.entryDate.getTime()) 
                ? -1 : 1;
        }
        return -1;
    }

    useEntry(date: Date): boolean {
        return (this.entryDate.getUTCFullYear() === date.getUTCFullYear()
            && this.entryDate.getMonth() === date.getUTCMonth()
            && this.entryDate.getUTCDate() === date.getUTCDate())
    }
}