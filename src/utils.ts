import {ProcessedEvent} from "./types/Event";

export function isOverlapping(column: Array<ProcessedEvent>, event: ProcessedEvent) {
    return column.some((otherEvent) => {
        return (
            event.startDate < otherEvent.endDate &&
            event.endDate > otherEvent.startDate
        );
    });
}