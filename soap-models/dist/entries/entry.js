"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoapEntry = void 0;
class SoapEntry {
    entryDate;
    title;
    scripture;
    observations;
    application;
    prayer;
    constructor(other) {
        this.entryDate = (other) ? new Date(other.entryDate) : new Date(0);
        this.title = (other) ? other.title : '';
        this.scripture = (other) ? other.scripture : '';
        this.observations = (other) ? other.observations : '';
        this.application = (other) ? other.application : '';
        this.prayer = (other) ? other.prayer : '';
    }
    compareTo(other) {
        if (other) {
            return (this.entryDate.getTime() < other.entryDate.getTime())
                ? -1 : 1;
        }
        return -1;
    }
    useEntry(date) {
        return (this.entryDate.getUTCFullYear() === date.getUTCFullYear()
            && this.entryDate.getMonth() === date.getUTCMonth()
            && this.entryDate.getUTCDate() === date.getUTCDate());
    }
}
exports.SoapEntry = SoapEntry;
//# sourceMappingURL=entry.js.map