import { ObjectId } from "mongodb";
import { PlanMonth } from "./month";

export class Plan {
    private id?: ObjectId;
    private name: string;
    private months: PlanMonth[];

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