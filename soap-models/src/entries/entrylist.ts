import { ISoapEntry, SoapEntry } from "./entry";


export interface ISoapEntryList {
    _id?: string;
    id?: string;
    userID?: string;
    lastName?: string;
    year: number;
    entries: ISoapEntry[];
}

export class SoapEntryList implements ISoapEntryList {
    public id: string;
    public userID?: string;
    public lastName?: string;
    public year: number;
    public entries: SoapEntry[];

    constructor(list?: ISoapEntryList) {
        this.id = (list && list.id) ? list.id : list._id.toString();
        this.userID = (list && list.userID) ? list.userID : undefined;
        this.lastName = (list && list.lastName) ? list.lastName : undefined;
        this.year = (list) ? list.year : 0;
        this.entries = [];
        if (list && list.entries.length > 0) {
            list.entries.forEach(entry => {
                const sEntry = new SoapEntry(entry);
                this.entries.push(sEntry);
            });
            this.entries.sort((a,b) => a.compareTo(b))
        }
    }

    addEntry(id: string, date: Date): SoapEntry {
        const entry = new SoapEntry();
        entry.id = id;
        entry.entryDate = new Date(date);
        this.entries.push(entry);
        this.entries.sort((a,b) => a.compareTo(b))
        return entry;
    }

    getEntry(id: string): SoapEntry | undefined {
        let entry: SoapEntry | undefined = undefined;
        this.entries.forEach(e => {
            if (e.id.toLowerCase() === id.toLowerCase()) {
                entry = new SoapEntry(e);
            }
        });
        return entry;
    }

    getEntryByDate(date: Date): SoapEntry | undefined {
        let entry: SoapEntry | undefined = undefined;
        this.entries.forEach(e => {
            if (e.entryDate.getUTCFullYear() === date.getUTCFullYear()
                && e.entryDate.getUTCMonth() === date.getUTCMonth()
                && e.entryDate.getUTCDate() === date.getUTCDate()) {
                entry = new SoapEntry(e);
            }
        })
        return entry;
    }

    updateEntry(id: string, field: string, value: string): SoapEntry | undefined {
        let found = false;
        for (let i=0; i < this.entries.length && !found; i++) {
            const entry = this.entries[i];
            if (entry.useEntry(id)) {
                found = true;
                switch (field.toLowerCase()) {
                    case "date":
                    case "entrydate":
                        entry.entryDate = new Date(Date.parse(value));
                        break;
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
                    case "read":
                        entry.read = (value.toLowerCase() === 'true');
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

    deleteEntry(id: string) {
        let found = -1;
        for (let i = 0; i < this.entries.length && found < 0; i++) {
            const entry = this.entries[i];
            if (entry.useEntry(id)) {
                found = i;
            }
        }
        if (found >= 0) {
            this.entries.splice(found, 1)
        } else {
            throw new Error('Entry not found');
        }
    }

    getEntries(start: Date, end: Date): SoapEntry[] {
        start = new Date(start);
        end = new Date(end);
        const list: SoapEntry[] = [];
        for (let i=0; i < this.entries.length; i++) {
            if (this.entries[i].entryDate.getTime() >= start.getTime() 
                && this.entries[i].entryDate.getTime() <= end.getTime()) {
                list.push(new SoapEntry(this.entries[i]));
            }
        }
        return list;
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