import { IBullet } from "./bullet";
import { IGraphic } from "./graphic";

export interface IParagraph {
  id: number;
  title: string;
  text: string[];
  bullets?: IBullet[];
  graphics?: IGraphic[];
}