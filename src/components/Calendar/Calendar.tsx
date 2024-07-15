import {Event, ProcessedEvent} from "../../types/Event";
import s from "./Calendar.module.css";
import {CalendarEvent} from "../Event/CalendarEvent";
import { useMemo } from "react";
import {useScreenSize} from "../../hooks/useScreenSize";


const  chooseColumn = (columns: Array<Array<ProcessedEvent>>, event: ProcessedEvent): Array<Event> | null => {
    // return column for event don't overlap with other events
    return columns.find((column) => {
        const isOverlapping = column.some((otherEvent) => {
            return (
                event.startDate < otherEvent.endDate &&
                event.endDate > otherEvent.startDate
            );
        });
        return !isOverlapping;
    }) || null
}
const splitEventsInColumns = (events: Array<Event>): Array<Array<ProcessedEvent>> => {
    const columns: Array<Array<ProcessedEvent>> = [];
    // order events by start date
    const sortedEvents = events.sort((a, b) => a.start.localeCompare(b.start))
    // process events to add start and end date
    const processedEvents = sortedEvents.map((event, index): ProcessedEvent => {
        const now = new Date();

        const startDate = new Date(`${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${event.start}`)
        const endDate = new Date(startDate)
        endDate.setMinutes(endDate.getMinutes() + event.duration);
        return {
            ...event,
            startDate,
            endDate,
        }
    });
    // split events in columns
    processedEvents.forEach((event) => {
        const column = chooseColumn(columns, event);
        if (column) {
            column.push(event);
        } else {
            // we create new column if we can't find column for event
            columns.push([event])
        }
    })
    return columns;

}
export const Calendar = ({ events }: {events: Array<Event>}) => {
    const columns = useMemo(() => splitEventsInColumns(events), [events]);
    const {height: pageHeight} = useScreenSize();
    if (!pageHeight) {
        return null;
    }
    return (
        <>
        <div className={s.container}>
            {columns.map((column, index) => (
                <div key={index} className={s.eventColumn}>
                    {column.map((event) => (
                        <CalendarEvent key={event.id} pageHeight={pageHeight} event={event} />
                    ))}
                </div>
            ))}
        </div></>
    );
}