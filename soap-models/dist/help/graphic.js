"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graphic = void 0;
class Graphic {
    id;
    caption;
    mimetype;
    filedata;
    constructor(image) {
        this.id = (image) ? image.id : 0;
        this.caption = (image) ? image.caption : '';
        this.mimetype = (image) ? image.mimetype : 'text/plain';
        this.filedata = (image) ? image.filedata : '';
    }
    compareTo(other) {
        if (other) {
            return (this.id < other.id) ? -1 : 1;
        }
        return -1;
    }
}
exports.Graphic = Graphic;
//# sourceMappingURL=graphic.js.map