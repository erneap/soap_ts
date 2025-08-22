import { Bullet, IBullet } from "./bullet";
import { Graphic, IGraphic } from "./graphic";
export interface IParagraph {
    id: number;
    title: string;
    text: string[];
    bullets?: IBullet[];
    graphics?: IGraphic[];
}
export declare class Paragraph implements IParagraph {
    id: number;
    title: string;
    text: string[];
    bullets?: Bullet[];
    graphics?: Graphic[];
    constructor(ip: IParagraph);
    compareTo(other?: Paragraph): number;
}
