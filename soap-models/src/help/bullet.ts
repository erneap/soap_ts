export interface IBullet {
  id: number;
  text: string;
}

export class Bullet implements IBullet {
  public id: number;
  public text: string;

  constructor(bullet?: IBullet) {
    this.id = (bullet) ? bullet.id : 0;
    this.text = (bullet) ? bullet.text : '';
  }

  compareTo(other?: Bullet) {
    if (other) {
      return (this.id < other.id) ? -1 : 1;
    }
    return -1;
  }
}