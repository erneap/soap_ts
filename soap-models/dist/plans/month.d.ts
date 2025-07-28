import { IPlanDay, PlanDay } from "./day";
import { Reading } from "./readings";
export interface IPlanMonth {
    month: number;
    days: IPlanDay[];
}
export declare class PlanMonth implements IPlanMonth {
    month: number;
    days: PlanDay[];
    constructor(month?: IPlanMonth);
    setMonth(id: number): void;
    getMonth(): number;
    compareTo(other?: PlanMonth): number;
    getDays(): PlanDay[];
    setDay(day: number, readings: Reading[]): void;
}
