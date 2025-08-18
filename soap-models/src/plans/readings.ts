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

    compareTo(other?: Reading) {
        if (other) {
            return (this.id < other.id) ? -1 : 1;
        }
        return -1;
    }
}