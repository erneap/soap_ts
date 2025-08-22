export interface NewEntryRequest {
    user: string;
    entrydate: string;
}
export interface UpdateEntryRequest {
    user: string;
    entrydate: string;
    field: string;
    value: string;
}
