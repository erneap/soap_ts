"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bullet = void 0;
class Bullet {
    id;
    text;
    constructor(bullet) {
        this.id = (bullet) ? bullet.id : 0;
        this.text = (bullet) ? bullet.text : '';
    }
    compareTo(other) {
        if (other) {
            return (this.id < other.id) ? -1 : 1;
        }
        return -1;
    }
}
exports.Bullet = Bullet;
//# sourceMappingURL=bullet.js.map