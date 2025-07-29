import { ObjectId } from "mongodb";
import { IPlanMonth, PlanMonth } from "./month";

export interface IPlan {
    _id?: ObjectId;
    name: string;
    months: IPlanMonth[];
    type?: string;
}

export class Plan implements IPlan{
    public _id: ObjectId;
    public id: ObjectId;
    public name: string;
    public months: PlanMonth[];
    public type: string;

    constructor(plan?: IPlan) {
        this._id = (plan && plan._id) ? plan._id : new ObjectId();
        this.id = (plan && plan._id) ? plan._id : this._id;
        this.name = (plan) ? plan.name : '';
        this.type = (plan && plan.type) ? plan.type : 'journal';
        this.months = [];
        if (plan && plan.months) {
            plan.months.forEach((month: IPlanMonth) => {
                this.months.push(new PlanMonth(month))
            });
            this.months.sort((a,b) => a.compareTo(b));
        }
    } 

    compareTo(other?: Plan): number {
        if (other) {
            if (this.name === other.name) {
                return (this.type < other.type) ? -1 : 1;
            }
            return (this.name < other.name) ? -1 : 1;
        }
    }
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