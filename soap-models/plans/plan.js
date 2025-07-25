"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plan = void 0;
const month_1 = require("./month");
class Plan {
    id;
    name;
    months;
    constructor(name, months, id) {
        this.name = name;
        this.id = (id) ? id : undefined;
        this.months = [];
        if (months) {
            months.forEach((month) => {
                this.months.push(new month_1.PlanMonth(month.getMonth()));
            });
            this.months.sort((a, b) => a.compareTo(b));
        }
    }
}
exports.Plan = Plan;
//# sourceMappingURL=plan.js.map