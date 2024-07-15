import s from './Line.module.css';
import {Event, ProcessedEvent} from "../../types/Event";
import {CalendarEvent} from "../CalendarEvent/CalendarEvent";
import {isOverlapping} from "../../utils";
export const Line = ({ events, pageHeight }: {events: Array<ProcessedEvent>, pageHeight: number}) => {
    const  chooseColumn = (columns: Array<Array<ProcessedEvent>>, event: ProcessedEvent): Array<Event> | null => {
        // return column for event don't overlap with other events
        return columns.find((column) => !isOverlapping(column, event)) || null
    }
    const splitEventsInColumns = (events: Array<ProcessedEvent>): Array<Array<ProcessedEvent>> => {
        const columns: Array<Array<ProcessedEvent>> = [];
        // split events in lines
        events.forEach((event) => {
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

    // find the earliest event
    const earlyEventStartMinute = events.reduce((acc, event) => {
        return Math.min(acc, ((event.startDate.getHours() - 9) * 60 + event.startDate.getMinutes()));
    }, 1440);

    const columns = splitEventsInColumns(events);

    return (
        <div className={s.eventLine} style={{top: `${earlyEventStartMinute *  (pageHeight / (12 * 60))}px`}}>
            {columns.map((column, index) => (
                <div key={index} className={s.column}>
                    {column.map((event) => (
                        <CalendarEvent key={event.id} pageHeight={pageHeight} column={column} event={event} earlyEventStartMinute={earlyEventStartMinute} />
                    ))}
                </div>
            ))}
        </div>
    );
}