"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanMonth = void 0;
const day_1 = require("./day");
class PlanMonth {
    month;
    days;
    constructor(month, days) {
        this.month = month;
        this.days = [];
        if (days) {
            days.forEach((day) => {
                this.days.push(new day_1.PlanDay(day.getDayOfMonth()));
            });
            days.sort((a, b) => a.compareTo(b));
        }
    }
    setMonth(id) {
        this.month = id;
    }
    getMonth() {
        return this.month;
    }
    compareTo(other) {
        if (other) {
            return (this.month < other.getMonth()) ? -1 : 1;
        }
        return -1;
    }
    getDays() {
        return this.days;
    }
    setDay(day, readings) {
        let found = false;
        for (let i = 0; i < this.days.length && !found; i++) {
            if (this.days[i].getDayOfMonth() === day) {
                found = true;
                readings.forEach((reading) => {
                    this.days[i].setReading(reading.getId(), reading.getBook(), reading.getChapter(), reading.getStartVerse(), reading.getEndVerse());
                });
            }
        }
        if (!found) {
            this.days.push(new day_1.PlanDay(day, readings));
            this.days.sort((a, b) => a.compareTo(b));
        }
    }
}
exports.PlanMonth = PlanMonth;
//# sourceMappingURL=month.js.map