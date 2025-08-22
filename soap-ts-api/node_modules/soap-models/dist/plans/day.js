"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanDay = void 0;
const readings_1 = require("./readings");
class PlanDay {
    dayOfMonth;
    readings;
    constructor(plan) {
        this.dayOfMonth = (plan) ? plan.dayOfMonth : 0;
        this.readings = [];
        if (plan && plan.readings) {
            plan.readings.forEach((reading) => {
                this.readings.push(new readings_1.Reading(reading));
            });
            this.readings.sort((a, b) => a.compareTo(b));
        }
    }
    setDayOfMonth(day) {
        this.dayOfMonth = day;
    }
    getDayOfMonth() {
        return this.dayOfMonth;
    }
    compareTo(other) {
        if (other) {
            return (this.dayOfMonth < other.getDayOfMonth()) ? -1 : 1;
        }
        return -1;
    }
    getReadings() {
        return this.readings;
    }
    setReading(id, book, chapter, start, end) {
        let found = false;
        let last = 0;
        for (let i = 0; i < this.readings.length && !found; i++) {
            if (this.readings[i].id === id) {
                found = true;
                this.readings[i].book = book;
                this.readings[i].chapter = chapter;
                this.readings[i].verseStart = start;
                this.readings[i].verseEnd = end;
            }
            else {
                if (last < this.readings[i].id) {
                    last = this.readings[i].id;
                }
            }
        }
        if (!found) {
            const reading = new readings_1.Reading();
            reading.id = last + 1;
            reading.book = book;
            reading.chapter = chapter;
            reading.verseStart = start;
            reading.verseEnd = end;
            this.readings.push(reading);
            this.readings.sort((a, b) => a.compareTo(b));
        }
    }
    getReading(id) {
        let result = undefined;
        for (let i = 0; i < this.readings.length && !result; i++) {
            if (this.readings[i].id === id) {
                result = this.readings[i];
            }
        }
        return result;
    }
}
exports.PlanDay = PlanDay;
//# sourceMappingURL=day.js.map