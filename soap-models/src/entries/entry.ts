export interface ISoapEntry {
    id?: string;
    entryDate: Date;
    title: string;
    scripture: string;
    observations: string;
    application: string;
    prayer: string;
    read?: boolean;
}

export class SoapEntry implements ISoapEntry {
    public id: string;
    public entryDate: Date;
    public title: string;
    public scripture: string;
    public observations: string;
    public application: string;
    public prayer: string;
    public read: boolean;

    constructor(other?: ISoapEntry) {
        this.id = (other && other.id) ? other.id : 'new';
        this.entryDate = (other) ? new Date(other.entryDate) : new Date(0);
        this.title = (other) ? other.title : '';
        this.scripture = (other) ? other.scripture : '';
        this.observations = (other) ? other.observations : '';
        this.application = (other) ? other.application : '';
        this.prayer = (other) ? other.prayer : '';
        this.read = (other && other.read) ? other.read : false;
    }

    compareTo(other?: SoapEntry): number {
        if (other) {
            return (this.entryDate.getTime() < other.entryDate.getTime()) 
                ? -1 : 1;
        }
        return -1;
    }

    useEntry(id: string): boolean {
        return (this.id.toLowerCase() === id.toLowerCase())
    }
}