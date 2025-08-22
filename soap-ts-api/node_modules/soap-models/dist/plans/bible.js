"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BibleBook = void 0;
class BibleBook {
    id;
    abbrev;
    title;
    chapters;
    testament;
    apocryphal;
    complete;
    constructor(book) {
        this.id = (book && book.id) ? book.id : 0;
        this.abbrev = (book) ? book.abbrev : '';
        this.title = (book) ? book.title : '';
        this.chapters = (book) ? book.chapters : 0;
        this.testament = (book && book.testament) ? book.testament : 'old';
        this.apocryphal = (book && book.apocryphal) ? book.apocryphal : false;
        this.complete = [];
        if (this.chapters > 0) {
            for (let c = 0; c >= this.chapters; c++) {
                this.complete.push(false);
            }
        }
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