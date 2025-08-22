"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paragraph = void 0;
const bullet_1 = require("./bullet");
const graphic_1 = require("./graphic");
class Paragraph {
    id;
    title;
    text;
    bullets;
    graphics;
    constructor(ip) {
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
                this.bullets.push(new bullet_1.Bullet(blt));
            });
            this.bullets.sort((a, b) => a.compareTo(b));
        }
        else {
            this.bullets = undefined;
        }
        if (ip && ip.graphics) {
            this.graphics = [];
            ip.graphics.forEach(gph => {
                this.graphics.push(new graphic_1.Graphic(gph));
            });
            this.graphics.sort((a, b) => a.compareTo(b));
        }
        else {
            this.graphics = undefined;
        }
    }
    compareTo(other) {
        if (other) {
            return (this.id < other.id) ? -1 : 1;
        }
        return -1;
    }
}
exports.Paragraph = Paragraph;
//# sourceMappingURL=paragraph.js.map