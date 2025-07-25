"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanDay = void 0;
const readings_1 = require("./readings");
class PlanDay {
    dayOfMonth;
    readings;
    constructor(dayOfMonth, readings) {
        this.dayOfMonth = dayOfMonth;
        this.readings = [];
        if (readings) {
            readings.forEach((reading) => {
                this.readings.push(new readings_1.Reading(reading.getId(), reading.getBook(), reading.getChapter(), reading.getStartVerse(), reading.getEndVerse()));
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
            if (this.readings[i].getId() === id) {
                found = true;
                this.readings[i].setBook(book);
                this.readings[i].setChapter(chapter);
                this.readings[i].setStartVerse(start);
                this.readings[i].setEndVerse(end);
            }
            else {
                if (last < this.readings[i].getId()) {
                    last = this.readings[i].getId();
                }
            }
        }
        if (!found) {
            this.readings.push(new readings_1.Reading(last + 1, book, chapter, start, end));
            this.readings.sort((a, b) => a.compareTo(b));
        }
    }
    getReading(id) {
        let result = undefined;
        for (let i = 0; i < this.readings.length && !result; i++) {
            if (this.readings[i].getId() === id) {
                result = this.readings[i];
            }
        }
        return result;
    }
}
exports.PlanDay = PlanDay;
//# sourceMappingURL=day.js.map