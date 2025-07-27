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
    type;
    constructor(plan) {
        this._id = (plan && plan._id) ? plan._id : new mongodb_1.ObjectId();
        this.id = (plan && plan._id) ? plan._id : this._id;
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
}
exports.Plan = Plan;
//# sourceMappingURL=plan.js.map