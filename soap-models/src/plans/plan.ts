import { ObjectId } from "mongodb";
import { PlanMonth } from "./month";

export class Plan {
    public id?: ObjectId;
    public name: string;
    public months: PlanMonth[];

    constructor(name: string, months?: PlanMonth[], id?: ObjectId) {
        this.name = name;
        this.id = (id) ? id : undefined;
        this.months = [];
        if (months) {
            months.forEach((month: PlanMonth) => {
                this.months.push(new PlanMonth(month.getMonth()))
            });
            this.months.sort((a,b) => a.compareTo(b));
        }
    } 
}