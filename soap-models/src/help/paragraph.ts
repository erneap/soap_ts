import { Bullet, IBullet } from "./bullet";
import { Graphic, IGraphic } from "./graphic";

export interface IParagraph {
  id: number;
  title: string;
  text: string[];
  bullets?: IBullet[];
  graphics?: IGraphic[];
}

export class Paragraph implements IParagraph {
  public id: number;
  public title: string;
  public text: string[];
  public bullets?: Bullet[];
  public graphics?: Graphic[];

  constructor(ip: IParagraph ) {
    this.id = (ip) ? ip.id : 0;
    this.title = (ip) ? ip.title : '';
    this.text = [];
    if (ip && ip.text.length > 0) {
      ip.text.forEach(txt => {
        this.text.push(txt);
      });
    }
    if (ip && ip.bullets) {
      this.bullets = [];
      ip.bullets.forEach(blt => {
        this.bullets.push(new Bullet(blt))
      });
      this.bullets.sort((a,b) => a.compareTo(b));
    } else {
      this.bullets = undefined;
    }
    if (ip && ip.graphics) {
      this.graphics = [];
      ip.graphics.forEach(gph => {
        this.graphics.push(new Graphic(gph));
      });
      this.graphics.sort((a,b) => a.compareTo(b));
    } else {
      this.graphics = undefined;
    }
  }

  compareTo(other?: Paragraph): number {
    if (other) {
      return (this.id < other.id) ? -1 : 1;
    }
    return -1;
  }
}