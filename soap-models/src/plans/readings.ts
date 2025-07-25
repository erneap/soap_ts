export class Reading {
    public id: number;
    public book: string;
    public chapter: number;
    public verseStart?: number;
    public verseEnd?: number;

    constructor(id: number, book: string, chapter: number, start?: number, 
        end?: number) {
        this.id = id;
        this.book = book;
        this.chapter = chapter;
        this.verseStart = (start) ? start : 0;
        this.verseEnd = (end) ? end : 0;
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