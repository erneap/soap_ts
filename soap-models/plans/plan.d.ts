import { ObjectId } from "mongodb";
import { PlanMonth } from "./month";
export declare class Plan {
    id?: ObjectId;
    name: string;
    months: PlanMonth[];
    constructor(name: string, months?: PlanMonth[], id?: ObjectId);
}
