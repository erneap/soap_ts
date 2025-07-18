export class SoapEntry {
    private entryDate: Date;
    private title: string;
    private scripture: string;
    private observations: string;
    private application: string;
    private prayer: string;

    constructor(entryDate: Date, title?: string, scripture?: string, 
        observations?: string, application?: string, prayer?: string) {
        this.entryDate = new Date(entryDate);
        this.title = (title) ? title : '';
        this.scripture = (scripture) ? scripture : '';
        this.observations = (observations) ? observations : '';
        this.application = (application) ? application : '';
        this.prayer = (prayer) ? prayer : '';
    }

    setEntryDate(date: Date) {
        this.entryDate = new Date(date);
    }

    getEntryDate(): Date {
        return this.entryDate;
    }

    compareTo(other?: SoapEntry): number {
        if (other) {
            return (this.entryDate.getTime() < other.getEntryDate().getTime()) ? -1 : 1;
        }
        return -1;
    }
}