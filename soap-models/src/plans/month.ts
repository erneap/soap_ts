import { IPlanDay, PlanDay } from "./day";
import { Reading } from "./readings";

export interface IPlanMonth {
    month: number;
    days: IPlanDay[];
}

export class PlanMonth implements IPlanMonth {
    public month: number;
    public days: PlanDay[];

    constructor(month?: IPlanMonth) {
        this.month = (month) ? month.month : 0;
        this.days = [];
        if (month && month.days) {
            month.days.forEach((day: IPlanDay) => {
                this.days.push(new PlanDay(day));
            });
            this.days.sort((a,b) => a.compareTo(b));
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
                        reading.id,
                        reading.book,
                        reading.chapter,
                        reading.verseStart,
                        reading.verseEnd
                    );
                });
            }
        }
        if (!found) {
            const oDay = new PlanDay();
            oDay.dayOfMonth = day;
            readings.forEach(read => {
                oDay.setReading(read.id, read.book, read.chapter, 
                    read.verseStart, read.verseEnd)
            })
            this.days.push(oDay);
            this.days.sort((a,b) => a.compareTo(b));
        }
    }
}