export interface IGraphic {
    id: number;
    caption: string;
    mimetype: string;
    filedata: string;
}
export declare class Graphic implements IGraphic {
    id: number;
    caption: string;
    mimetype: string;
    filedata: string;
    constructor(image?: IGraphic);
    compareTo(other?: Graphic): number;
}
