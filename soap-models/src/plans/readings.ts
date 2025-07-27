export interface IReading {
    id: number;
    book: string;
    chapter: number;
    verseStart?: number;
    verseEnd?: number;
}

export class Reading implements IReading {
    public id: number;
    public book: string;
    public chapter: number;
    public verseStart?: number;
    public verseEnd?: number;

    constructor(read?: IReading) {
        this.id = (read) ? read.id : -1;
        this.book = (read) ? read.book : '';
        this.chapter = (read) ? read.chapter : 0;
        this.verseStart = (read && read.verseStart) ? read.verseStart : undefined;
        this.verseEnd = (read && read.verseEnd) ? read.verseEnd : undefined;
    }

    setId(id: number) {
        this.id = id;
    }

    getId(): number {
        return this.id;
    }

    compareTo(other?: Reading) {
        if (other) {
            if (this.book === other.getBook()) {
                return (this.chapter < other.getChapter()) ? -1 : 1;
            }
            return (this.id < other.getId()) ? -1 : 1;
        }
        return -1;
    }

    setBook(book: string) {
        this.book = book;
    }

    getBook(): string {
        return this.book;
    }

    setChapter(chptr: number) {
        this.chapter = chptr;
    }

    getChapter(): number {
        return this.chapter;
    }

    setStartVerse(start: number) {
        this.verseStart = start;
    }

    getStartVerse(): number | undefined {
        return this.verseStart;
    }

    setEndVerse(end: number) {
        this.verseEnd = end;
    }

    getEndVerse(): number | undefined {
        return this.verseEnd;
    }
}