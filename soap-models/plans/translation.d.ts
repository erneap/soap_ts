export interface ITranslation {
    id: number;
    short: string;
    long: string;
}
export declare class Translation implements ITranslation {
    id: number;
    short: string;
    long: string;
    constructor(id?: number, short?: string, long?: string);
    compareTo(other?: Translation): number;
}
export interface ITranslationList {
    list: ITranslation[];
}
export declare class TranslationList implements ITranslationList {
    list: Translation[];
    constructor(list?: Translation[]);
    addTranslation(short: string, long: string): Translation | undefined;
}
