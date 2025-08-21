export interface IGraphic {
  id: number;
  caption: string;
  filedata: Blob;
}

export class Graphic implements IGraphic {
  public id: number;
  public caption: string;
  public filedata: Blob;

  constructor(image?: IGraphic) {
    this.id = (image) ? image.id : 0;
    this.caption = (image) ? image.caption : '';
    this.filedata = (image) 
      ? new Blob([image.filedata], { type: image.filedata.type }) 
      : new Blob();
  }

  compareTo(other?: Graphic): number {
    if (other) {
      return (this.id < other.id) ? -1 : 1;
    }
    return -1;
  }
}