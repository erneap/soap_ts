import { ObjectId } from "mongodb";

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

    constructor(entry?: ISoapEntry) {
        this.entryDate = (entry) ? new Date(entry.entryDate) : new Date();
        this.title = (entry) ? entry.title : '';
        this.scripture = (entry) ? entry.scripture : '';
        this.observations = (entry) ? entry.observations : '';
        this.application = (entry) ? entry.application : '';
        this.prayer = (entry) ? entry.prayer : '';
    }

    setEntryDate(date: Date) {
        this.entryDate = new Date(date);
    }

    getEntryDate(): Date {
        return this.entryDate;
    }

    compareTo(other?: SoapEntry): number {
        if (other) {
            return (this.entryDate.getTime() < other.getEntryDate().getTime()) ? -1 : 1;
        }
        return -1;
    }
}

export interface ISoapEntryList {
    _id: ObjectId;
    userID?: ObjectId;
    lastName?: string;
    year: number;
    entries: ISoapEntry[];
}

export class SoapEntryList implements ISoapEntryList {
    public _id: ObjectId;
    public userID?: ObjectId;
    public lastName?: string;
    public year: number;
    public entries: SoapEntry[];

    constructor(list?: ISoapEntryList) {
        this._id = (list) ? list._id : new ObjectId();
        this.userID = (list && list.userID) ? list.userID : undefined;
        this.lastName = (list && list.lastName) ? list.lastName : undefined;
        this.year = (list) ? list.year : 0;
        this.entries = [];
        if (list && list.entries.length > 0) {
            list.entries.forEach(entry => {
                this.entries.push(new SoapEntry(entry));
            });
            this.entries.sort((a,b) => a.compareTo(b))
        }
    }

    addEntry(date: Date): SoapEntry {
        const entry = new SoapEntry();
        entry.entryDate = new Date(date);
        this.entries.push(entry);
        this.entries.sort((a,b) => a.compareTo(b))
        return entry;
    }

    getEntry(date: Date): SoapEntry | undefined {
        let entry: SoapEntry | undefined = undefined;
        const testDate = new Date(date);
        this.entries.forEach(e => {
            if (testDate.getFullYear() === e.entryDate.getFullYear()
                && testDate.getMonth() === e.entryDate.getMonth()
                && testDate.getDate() === e.entryDate.getDate()) {
                entry = new SoapEntry(e);
            }
        });
        return entry;
    }

    updateEntry(date: Date, field: string, value: string): SoapEntry | undefined {
        const tDate = new Date(date);
        let found = false;
        for (let i=0; i < this.entries.length && !found; i++) {
            const entry = this.entries[i];
            if (tDate.getFullYear() === entry.entryDate.getFullYear()
                && tDate.getMonth() === entry.entryDate.getMonth()
                && tDate.getDate() === entry.entryDate.getDate()) {
                found = true;
                switch (field.toLowerCase()) {
                    case "title":
                        entry.title = value;
                        break;
                    case "scripture":
                        entry.scripture = value;
                        break;
                    case "observations":
                        entry.observations = value;
                        break;
                    case "application":
                        entry.application = value;
                        break;
                    case "prayer":
                        entry.prayer = value;
                        break;
                }
                this.entries[i] = entry;
                return new SoapEntry(entry);
            }
        }
        if (!found) {
            throw new Error("Entry not found");
        }
        return undefined;
    }

    deleteEntry(date: Date) {
        const tDate = new Date(date);
        let found = -1;
        for (let i = 0; i < this.entries.length && !found; i++) {
            const entry = this.entries[i];
            if (tDate.getFullYear() === entry.entryDate.getFullYear()
                && tDate.getMonth() === entry.entryDate.getMonth()
                && tDate.getDate() === entry.entryDate.getDate()) {
                found = i;
            }
        }
        if (found >= 0) {
            this.entries.splice(found, 1)
        } else {
            throw new Error('Entry not found');
        }
    }

    compareTo(other?: SoapEntryList): number {
        if (other) {
            if (this.userID.toString() === other.userID.toString()) {
                return (this.year < other.year) ? -1 : 1;
            }
            return (this.userID.toString() < other.userID.toString()) ? -1 : 1;
        }
        return -1;
    }
}