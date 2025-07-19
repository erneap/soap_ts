import { PlanDay } from "./day";
import { Reading } from "./readings";

export class PlanMonth {
    public month: number;
    public days: PlanDay[];

    constructor(month: number, days?: PlanDay[]) {
        this.month = month;
        this.days = [];
        if (days) {
            days.forEach((day: PlanDay) => {
                this.days.push(new PlanDay(day.getDayOfMonth()));
            });
            days.sort((a,b) => a.compareTo(b));
        }
    }

    setMonth(id: number) {
        this.month = id;
    }

    getMonth(): number {
        return this.month;
    }

    compareTo(other?: PlanMonth): number {
        if (other) {
            return (this.month < other.getMonth()) ? -1 : 1;
        }
        return -1;
    }

    getDays(): PlanDay[] {
        return this.days;
    }

    setDay(day: number, readings: Reading[]) {
        let found = false;
        for (let i = 0; i < this.days.length && !found; i++) {
            if (this.days[i].getDayOfMonth() === day) {
                found = true;
                readings.forEach((reading: Reading) => {
                    this.days[i].setReading(
                        reading.getId(),
                        reading.getBook(),
                        reading.getChapter(),
                        reading.getStartVerse(),
                        reading.getEndVerse()
                    );
                });
            }
        }
        if (!found) {
            this.days.push(new PlanDay(day, readings));
            this.days.sort((a,b) => a.compareTo(b));
        }
    }
}