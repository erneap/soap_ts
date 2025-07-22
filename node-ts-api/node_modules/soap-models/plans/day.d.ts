import { Reading } from "./readings";
export declare class PlanDay {
    dayOfMonth: number;
    readings: Reading[];
    constructor(dayOfMonth: number, readings?: Reading[]);
    setDayOfMonth(day: number): void;
    getDayOfMonth(): number;
    compareTo(other?: PlanDay): number;
    getReadings(): Reading[];
    setReading(id: number, book: string, chapter: number, start?: number, end?: number): void;
    getReading(id: number): Reading | undefined;
}
