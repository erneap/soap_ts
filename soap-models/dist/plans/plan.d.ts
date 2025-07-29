import { ObjectId } from "mongodb";
import { IPlanMonth, PlanMonth } from "./month";
export interface IPlan {
    _id?: ObjectId;
    name: string;
    months: IPlanMonth[];
    type?: string;
}
export declare class Plan implements IPlan {
    _id: ObjectId;
    id: ObjectId;
    name: string;
    months: PlanMonth[];
    type: string;
    constructor(plan?: IPlan);
    compareTo(other?: Plan): number;
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
