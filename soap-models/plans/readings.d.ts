export interface IReading {
    id: number;
    book: string;
    chapter: number;
    verseStart?: number;
    verseEnd?: number;
}
export declare class Reading implements IReading {
    id: number;
    book: string;
    chapter: number;
    verseStart?: number;
    verseEnd?: number;
    constructor(read?: IReading);
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
