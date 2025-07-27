import { ObjectId } from "mongodb";
import { IPlanMonth, PlanMonth } from "./month";

export interface IPlan {
    _id?: ObjectId;
    name: string;
    months: IPlanMonth[]
}
export class Plan implements IPlan{
    public _id: ObjectId;
    public id: ObjectId;
    public name: string;
    public months: PlanMonth[];

    constructor(plan?: IPlan) {
        this._id = (plan && plan._id) ? plan._id : new ObjectId();
        this.id = (plan && plan._id) ? plan._id : this._id;
        this.name = (plan) ? plan.name : '';
        this.months = [];
        if (plan && plan.months) {
            plan.months.forEach((month: IPlanMonth) => {
                this.months.push(new PlanMonth(month))
            });
            this.months.sort((a,b) => a.compareTo(b));
        }
    } 
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