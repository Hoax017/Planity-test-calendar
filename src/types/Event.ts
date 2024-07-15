export type Event = {
    id: number;
    start: string;
    duration: number;
}

export type ProcessedEvent = Event & {
    startDate: Date;
    endDate: Date;
}