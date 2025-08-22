export interface IBullet {
    id: number;
    text: string;
}
export declare class Bullet implements IBullet {
    id: number;
    text: string;
    constructor(bullet?: IBullet);
    compareTo(other?: Bullet): 1 | -1;
}
