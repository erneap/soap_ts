"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plan = void 0;
const month_1 = require("./month");
const bible_1 = require("./bible");
class Plan {
    id;
    name;
    months;
    type;
    constructor(plan) {
        this.id = (plan && plan.id) ? plan.id : '';
        if (this.id === '') {
            this.id = (plan && plan._id) ? plan._id.toString() : '';
        }
        this.name = (plan) ? plan.name : '';
        this.type = (plan && plan.type) ? plan.type : 'journal';
        this.months = [];
        if (plan && plan.months) {
            plan.months.forEach((month) => {
                this.months.push(new month_1.PlanMonth(month));
            });
            this.months.sort((a, b) => a.compareTo(b));
        }
    }
    compareTo(other) {
        if (other) {
            if (this.name === other.name) {
                return (this.type < other.type) ? -1 : 1;
            }
            return (this.name < other.name) ? -1 : 1;
        }
    }
    checkPlan(books) {
        const bibleBooks = [];
        books.forEach(bk => {
            bibleBooks.push(new bible_1.BibleBook(bk));
        });
        bibleBooks.sort((a, b) => a.compareTo(b));
        if (this.months.length > 0) {
            this.months.forEach(month => {
                month.days.forEach(day => {
                    day.readings.forEach(read => {
                        bibleBooks.forEach((bk, b) => {
                            if (read.book.toLowerCase() === bk.abbrev.toLowerCase()) {
                                bk.complete[read.chapter] = true;
                            }
                        });
                    });
                });
            });
        }
        const answer = [];
        bibleBooks.forEach(bk => {
            let found = '';
            bk.complete.forEach((ch, c) => {
                if (!ch && c > 0) {
                    if (found === '') {
                        found = bk.title + ": ";
                    }
                    else {
                        found += ', ';
                    }
                    found += `${c}`;
                }
            });
            if (found !== '') {
                answer.push(found);
            }
        });
        return answer;
    }
}
exports.Plan = Plan;
//# sourceMappingURL=plan.js.map