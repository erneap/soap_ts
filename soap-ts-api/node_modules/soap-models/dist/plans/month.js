"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanMonth = void 0;
const day_1 = require("./day");
class PlanMonth {
    month;
    days;
    constructor(month) {
        this.month = (month) ? month.month : 0;
        this.days = [];
        if (month && month.days) {
            month.days.forEach((day) => {
                this.days.push(new day_1.PlanDay(day));
            });
            this.days.sort((a, b) => a.compareTo(b));
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
                    this.days[i].setReading(reading.id, reading.book, reading.chapter, reading.verseStart, reading.verseEnd);
                });
            }
        }
        if (!found) {
            const oDay = new day_1.PlanDay();
            oDay.dayOfMonth = day;
            readings.forEach(read => {
                oDay.setReading(read.id, read.book, read.chapter, read.verseStart, read.verseEnd);
            });
            this.days.push(oDay);
            this.days.sort((a, b) => a.compareTo(b));
        }
    }
}
exports.PlanMonth = PlanMonth;
//# sourceMappingURL=month.js.map