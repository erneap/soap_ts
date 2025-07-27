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
export interface UpdatePlanRequest {
    id: string;
    field: string;
    value: string;
}
export interface UpdatePlanMonthRequest {
    id: string;
    month: number;
    field: string;
    value: string;
}
export interface UpdatePlanDayRequest {
    id: string;
    month: number;
    day: number;
    field: string;
    value: string;
}
export interface NewPlanDayReadingRequest {
    id: string;
    month: number;
    day: number;
    book: string;
    chapter: string;
    start?: number;
    end?: number;
}
export interface UpdatePlanDayReadingRequest {
    id: string;
    month: number;
    day: number;
    readingID: number;
    field: string;
    value: string;
}
