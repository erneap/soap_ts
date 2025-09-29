import { ObjectId } from "mongodb";
import { IPlanMonth, PlanMonth } from "./month";
import { BibleBook, IBibleBook } from "./bible";

export interface IPlan {
	_id?: ObjectId;
	id?: string;
	name: string;
	months: IPlanMonth[];
	type?: string;
}

export class Plan implements IPlan {
	public id: string;
	public name: string;
	public months: PlanMonth[];
	public type: string;

	constructor(plan?: IPlan) {
		this.id = (plan && plan.id) ? plan.id : '';
		if (this.id === '') {
			this.id = (plan && plan._id) ? plan._id.toString() : '';
		}
		this.name = (plan) ? plan.name : '';
		this.type = (plan && plan.type) ? plan.type : 'journal';
		this.months = [];
		if (plan && plan.months) {
			plan.months.forEach((month: IPlanMonth) => {
				this.months.push(new PlanMonth(month))
			});
			this.months.sort((a, b) => a.compareTo(b));
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

	checkPlan(books: IBibleBook[]): string[] {
		const bibleBooks: BibleBook[] = [];
		books.forEach(bk => {
			bibleBooks.push(new BibleBook(bk));
		});
		bibleBooks.sort((a, b) => a.compareTo(b));
		if (this.months.length > 0) {
			this.months.forEach(month => {
				month.days.forEach(day => {
					day.readings.forEach(read => {
						bibleBooks.forEach((bk, b) => {
							if (read.book.toLowerCase() === bk.abbrev.toLowerCase()) {
								bk.complete[read.chapter] = true;
							}
						});
					});
				});
			});
		}
		const answer: string[] = [];
		bibleBooks.forEach(bk => {
			let found = '';
			bk.complete.forEach((ch, c) => {
				if (!ch && c > 0) {
					if (found === '') {
						found = bk.title + ": ";
					} else {
						found += ', ';
					}
					found += `${c}`;
				}
			});
			if (found !== '') {
				answer.push(found);
			}
		});
		return answer;
	}
}

export interface NewPlanRequest {
	name: string;
	plantype: string;
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