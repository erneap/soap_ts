import { PlanDay } from "./day";
import { Reading } from "./readings";
export declare class PlanMonth {
    month: number;
    days: PlanDay[];
    constructor(month: number, days?: PlanDay[]);
    setMonth(id: number): void;
    getMonth(): number;
    compareTo(other?: PlanMonth): number;
    getDays(): PlanDay[];
    setDay(day: number, readings: Reading[]): void;
}
