export interface IGraphic {
  id: number;
  caption: string;
  mimetype: string;
  filedata: string;
}

export class Graphic implements IGraphic {
  public id: number;
  public caption: string;
  public mimetype: string;
  public filedata: string;

  constructor(image?: IGraphic) {
    this.id = (image) ? image.id : 0;
    this.caption = (image) ? image.caption : '';
    this.mimetype = (image) ? image.mimetype : 'text/plain';
    this.filedata = (image) ? image.filedata : '';
  }

  compareTo(other?: Graphic): number {
    if (other) {
      return (this.id < other.id) ? -1 : 1;
    }
    return -1;
  }
}