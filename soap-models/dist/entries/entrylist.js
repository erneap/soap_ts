"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoapEntryList = void 0;
const mongodb_1 = require("mongodb");
const entry_1 = require("./entry");
class SoapEntryList {
    _id;
    userID;
    lastName;
    year;
    entries;
    constructor(list) {
        this._id = (list) ? list._id : new mongodb_1.ObjectId();
        this.userID = (list && list.userID) ? list.userID : undefined;
        this.lastName = (list && list.lastName) ? list.lastName : undefined;
        this.year = (list) ? list.year : 0;
        this.entries = [];
        if (list && list.entries.length > 0) {
            list.entries.forEach(entry => {
                this.entries.push(new entry_1.SoapEntry(entry));
            });
            this.entries.sort((a, b) => a.compareTo(b));
        }
    }
    addEntry(date) {
        const entry = new entry_1.SoapEntry();
        entry.entryDate = new Date(date);
        this.entries.push(entry);
        this.entries.sort((a, b) => a.compareTo(b));
        return entry;
    }
    getEntry(date) {
        let entry = undefined;
        const testDate = new Date(date);
        this.entries.forEach(e => {
            if (testDate.getUTCFullYear() === e.entryDate.getUTCFullYear()
                && testDate.getUTCMonth() === e.entryDate.getUTCMonth()
                && testDate.getUTCDate() === e.entryDate.getUTCDate()) {
                entry = new entry_1.SoapEntry(e);
            }
        });
        return entry;
    }
    updateEntry(date, field, value) {
        const tDate = new Date(date);
        let found = false;
        for (let i = 0; i < this.entries.length && !found; i++) {
            const entry = this.entries[i];
            if (tDate.getUTCFullYear() === entry.entryDate.getUTCFullYear()
                && tDate.getUTCMonth() === entry.entryDate.getUTCMonth()
                && tDate.getUTCDate() === entry.entryDate.getUTCDate()) {
                found = true;
                switch (field.toLowerCase()) {
                    case "date":
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
                }
                this.entries[i] = entry;
                return new entry_1.SoapEntry(entry);
            }
        }
        if (!found) {
            throw new Error("Entry not found");
        }
        return undefined;
    }
    deleteEntry(date) {
        const tDate = new Date(date);
        let found = -1;
        for (let i = 0; i < this.entries.length && found < 0; i++) {
            const entry = this.entries[i];
            if (tDate.getUTCFullYear() === entry.entryDate.getUTCFullYear()
                && tDate.getUTCMonth() === entry.entryDate.getUTCMonth()
                && tDate.getUTCDate() === entry.entryDate.getUTCDate()) {
                found = i;
            }
        }
        if (found >= 0) {
            this.entries.splice(found, 1);
        }
        else {
            throw new Error('Entry not found');
        }
    }
    getEntries(start, end) {
        start = new Date(start);
        end = new Date(end);
        const list = [];
        for (let i = 0; i < this.entries.length; i++) {
            if (this.entries[i].entryDate.getTime() >= start.getTime()
                && this.entries[i].entryDate.getTime() <= end.getTime()) {
                list.push(new entry_1.SoapEntry(this.entries[i]));
            }
        }
        return list;
    }
    compareTo(other) {
        if (other) {
            if (this.userID.toString() === other.userID.toString()) {
                return (this.year < other.year) ? -1 : 1;
            }
            return (this.userID.toString() < other.userID.toString()) ? -1 : 1;
        }
        return -1;
    }
}
exports.SoapEntryList = SoapEntryList;
//# sourceMappingURL=entrylist.js.map