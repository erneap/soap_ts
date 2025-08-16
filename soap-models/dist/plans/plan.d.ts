import { ObjectId } from "mongodb";
import { IPlanMonth, PlanMonth } from "./month";
import { IBibleBook } from "./bible";
export interface IPlan {
    _id?: ObjectId;
    id?: string;
    name: string;
    months: IPlanMonth[];
    type?: string;
}
export declare class Plan implements IPlan {
    id: string;
    name: string;
    months: PlanMonth[];
    type: string;
    constructor(plan?: IPlan);
    compareTo(other?: Plan): number;
    checkPlan(books: IBibleBook[]): string[];
}
export interface NewPlanRequest {
    name: string;
    months: number;
}
export interface NewPlanDayReadingRequest {
    id: string;
    month: number;
    day: number;
    book: string;
    chapter: number;
    start?: number;
    end?: number;
}
export interface UpdatePlanRequest {
    id: string;
    month?: number;
    day?: number;
    readingID?: number;
    field: string;
    value: string;
}
