"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plan = void 0;
const mongodb_1 = require("mongodb");
const month_1 = require("./month");
class Plan {
    _id;
    id;
    name;
    months;
    constructor(plan) {
        this._id = (plan && plan._id) ? plan._id : new mongodb_1.ObjectId();
        this.id = (plan && plan._id) ? plan._id : this._id;
        this.name = (plan) ? plan.name : '';
        this.months = [];
        if (plan && plan.months) {
            plan.months.forEach((month) => {
                this.months.push(new month_1.PlanMonth(month));
            });
            this.months.sort((a, b) => a.compareTo(b));
        }
    }
}
exports.Plan = Plan;
//# sourceMappingURL=plan.js.map