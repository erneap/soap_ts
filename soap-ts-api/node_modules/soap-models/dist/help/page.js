"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
const paragraph_1 = require("./paragraph");
class Page {
    id;
    page;
    permission;
    header;
    subheader;
    paragraphs;
    constructor(page) {
        this.id = (page && page.id) ? page.id : '';
        if (this.id === '' && page && page._id) {
            this.id = page._id.toString();
        }
        this.page = (page) ? page.page : 0;
        this.permission = (page && page.permission) ? page.permission : 0;
        this.header = (page) ? page.header : '';
        this.subheader = (page) ? page.subheader : '';
        this.paragraphs = [];
        if (page && page.paragraphs && page.paragraphs.length > 0) {
            page.paragraphs.forEach(para => {
                this.paragraphs.push(new paragraph_1.Paragraph(para));
            });
            this.paragraphs.sort((a, b) => a.compareTo(b));
        }
    }
    compareTo(other) {
        if (other) {
            return (this.page < other.page) ? -1 : 1;
        }
        return -1;
    }
    hasPermission(level) {
        return ((this.permission & level) === level);
    }
}
exports.Page = Page;
//# sourceMappingURL=page.js.map