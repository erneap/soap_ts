"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BibleBook = void 0;
class BibleBook {
    id;
    abbrev;
    title;
    chapters;
    constructor(book) {
        this.id = (book && book.id) ? book.id : 0;
        this.abbrev = (book) ? book.abbrev : '';
        this.title = (book) ? book.title : '';
        this.chapters = (book) ? book.chapters : 0;
    }
    compareTo(other) {
        if (other) {
            return (this.id < other.id) ? -1 : 1;
        }
        return -1;
    }
}
exports.BibleBook = BibleBook;
//# sourceMappingURL=bible.js.map