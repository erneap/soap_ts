"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reading = void 0;
class Reading {
    id;
    book;
    chapter;
    verseStart;
    verseEnd;
    constructor(read) {
        this.id = (read) ? read.id : -1;
        this.book = (read) ? read.book : '';
        this.chapter = (read) ? read.chapter : 0;
        this.verseStart = (read && read.verseStart) ? read.verseStart : undefined;
        this.verseEnd = (read && read.verseEnd) ? read.verseEnd : undefined;
    }
    compareTo(other) {
        if (other) {
            return (this.id < other.id) ? -1 : 1;
        }
        return -1;
    }
}
exports.Reading = Reading;
//# sourceMappingURL=readings.js.map