"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationList = exports.Translation = void 0;
class Translation {
    constructor(id, short, long) {
        this.id = (id) ? id : 0;
        this.short = (short) ? short : '';
        this.long = (long) ? long : '';
    }
    compareTo(other) {
        if (other) {
            return (this.id < other.id) ? -1 : 1;
        }
        return -1;
    }
}
exports.Translation = Translation;
class TranslationList {
    constructor(list) {
        this.list = [];
        if (list) {
            list.forEach((item) => {
                this.list.push(new Translation(item.id, item.short, item.long));
            });
        }
        this.list.sort((a, b) => a.compareTo(b));
    }
    addTranslation(short, long) {
        let last = 0;
        let found = false;
        for (let i = 0; i < this.list.length && !found; i++) {
            if (this.list[i].short.toLowerCase() === short.toLowerCase()) {
                found = true;
            }
            else if (this.list[i].id > last) {
                last = this.list[i].id;
            }
        }
        if (!found) {
            const translation = new Translation(last + 1, short, long);
            this.list.push(translation);
            return translation;
        }
        return undefined;
    }
}
exports.TranslationList = TranslationList;
//# sourceMappingURL=translation.js.map