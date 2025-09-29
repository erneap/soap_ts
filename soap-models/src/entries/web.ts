export interface NewEntryRequest {
    user: string;
    entrydate: string;
}

export interface UpdateEntryRequest {
    user: string;
    year: number;
    id: string;
    field: string;
    value: string;
}