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
    compareTo(other?: Reading): 1 | -1;
}
