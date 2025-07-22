"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoapEntry = void 0;
class SoapEntry {
    constructor(entryDate, title, scripture, observations, application, prayer) {
        this.entryDate = new Date(entryDate);
        this.title = (title) ? title : '';
        this.scripture = (scripture) ? scripture : '';
        this.observations = (observations) ? observations : '';
        this.application = (application) ? application : '';
        this.prayer = (prayer) ? prayer : '';
    }
    setEntryDate(date) {
        this.entryDate = new Date(date);
    }
    getEntryDate() {
        return this.entryDate;
    }
    compareTo(other) {
        if (other) {
            return (this.entryDate.getTime() < other.getEntryDate().getTime()) ? -1 : 1;
        }
        return -1;
    }
}
exports.SoapEntry = SoapEntry;
//# sourceMappingURL=entry.js.map