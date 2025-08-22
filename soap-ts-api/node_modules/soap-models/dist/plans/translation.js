"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationList = exports.Translation = void 0;
class Translation {
    id;
    short;
    long;
    constructor(trans) {
        this.id = (trans && trans.id) ? trans.id : 0;
        this.short = (trans && trans.short) ? trans.short : '';
        this.long = (trans && trans.long) ? trans.long : '';
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
    list;
    constructor(list) {
        this.list = [];
        if (list && list.list) {
            list.list.forEach((item) => {
                this.list.push(new Translation(item));
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
            const item = { id: last + 1, short, long };
            const translation = new Translation(item);
            this.list.push(translation);
            return translation;
        }
        return undefined;
    }
}
exports.TranslationList = TranslationList;
//# sourceMappingURL=translation.js.map