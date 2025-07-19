"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reading = void 0;
class Reading {
    constructor(id, book, chapter, start, end) {
        this.id = id;
        this.book = book;
        this.chapter = chapter;
        this.verseStart = (start) ? start : 0;
        this.verseEnd = (end) ? end : 0;
    }
    setId(id) {
        this.id = id;
    }
    getId() {
        return this.id;
    }
    compareTo(other) {
        if (other) {
            if (this.book === other.getBook()) {
                return (this.chapter < other.getChapter()) ? -1 : 1;
            }
            return (this.id < other.getId()) ? -1 : 1;
        }
        return -1;
    }
    setBook(book) {
        this.book = book;
    }
    getBook() {
        return this.book;
    }
    setChapter(chptr) {
        this.chapter = chptr;
    }
    getChapter() {
        return this.chapter;
    }
    setStartVerse(start) {
        this.verseStart = start;
    }
    getStartVerse() {
        return this.verseStart;
    }
    setEndVerse(end) {
        this.verseEnd = end;
    }
    getEndVerse() {
        return this.verseEnd;
    }
}
exports.Reading = Reading;
//# sourceMappingURL=readings.js.map