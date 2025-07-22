export declare class Reading {
    id: number;
    book: string;
    chapter: number;
    verseStart?: number;
    verseEnd?: number;
    constructor(id: number, book: string, chapter: number, start?: number, end?: number);
    setId(id: number): void;
    getId(): number;
    compareTo(other?: Reading): 1 | -1;
    setBook(book: string): void;
    getBook(): string;
    setChapter(chptr: number): void;
    getChapter(): number;
    setStartVerse(start: number): void;
    getStartVerse(): number | undefined;
    setEndVerse(end: number): void;
    getEndVerse(): number | undefined;
}
