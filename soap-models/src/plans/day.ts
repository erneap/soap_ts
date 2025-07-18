import { Reading } from "./readings";

export class PlanDay {
    private dayOfMonth: number;
    private readings: Reading[];

    constructor(dayOfMonth: number, readings?: Reading[]) {
        this.dayOfMonth = dayOfMonth;
        this.readings = [];
        if (readings) {
            readings.forEach((reading: Reading) => {
                this.readings.push(new Reading(
                    reading.getId(),
                    reading.getBook(),
                    reading.getChapter(),
                    reading.getStartVerse(),
                    reading.getEndVerse()
                ));
            });
            this.readings.sort((a,b) => a.compareTo(b));
        }
    }

    setDayOfMonth(day: number) {
        this.dayOfMonth = day;
    }

    getDayOfMonth(): number {
        return this.dayOfMonth;
    }

    compareTo(other?: PlanDay): number {
        if (other) {
            return (this.dayOfMonth < other.getDayOfMonth()) ? -1 : 1;
        }
        return -1;
    }

    getReadings(): Reading[] {
        return this.readings;
    }

    setReading(id: number, book: string, chapter: number, start?: number, 
        end?: number) {
        let found = false;
        let last = 0;
        for (let i=0; i < this.readings.length && !found; i++) {
            if (this.readings[i].getId() === id) {
                found = true;
                this.readings[i].setBook(book);
                this.readings[i].setChapter(chapter);
                this.readings[i].setStartVerse(start);
                this.readings[i].setEndVerse(end);
            } else {
                if (last < this.readings[i].getId()) {
                    last = this.readings[i].getId();
                }
            }
        }
        if (!found) {
            this.readings.push(new Reading(last + 1, book, chapter, start, end));
            this.readings.sort((a,b) => a.compareTo(b));
        }
    }

    getReading(id: number): Reading | undefined {
        let result: Reading | undefined = undefined;
        for (let i=0; i < this.readings.length && !result; i++) {
            if (this.readings[i].getId() === id) {
                result = this.readings[i];
            }
        }

        return result;
    }
}