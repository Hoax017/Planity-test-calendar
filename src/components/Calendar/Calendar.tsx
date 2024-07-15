import {Event, ProcessedEvent} from "../../types/Event";
import s from "./Calendar.module.css";
import {useMemo} from "react";
import {useScreenSize} from "../../hooks/useScreenSize";
import {Line} from "../Line/Line";
import {isOverlapping} from "../../utils";


const  chooseLine = (lines: Array<Array<ProcessedEvent>>, event: ProcessedEvent): Array<Event> | null => {
    // return column for event don't overlap with other events
    return lines.find((line) => isOverlapping(line, event)) || null
}
const splitEventsInLines = (events: Array<Event>): Array<Array<ProcessedEvent>> => {
    const lines: Array<Array<ProcessedEvent>> = [];
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
    // split events in lines
    processedEvents.forEach((event) => {
        const line = chooseLine(lines, event);
        if (line) {
            line.push(event);
        } else {
            // we create new line if we can't find line for event
            lines.push([event])
        }
    })
    return lines;

}
export const Calendar = ({ events }: {events: Array<Event>}) => {
    const lines = useMemo(() => splitEventsInLines(events), [events]);
    const {height: pageHeight} = useScreenSize();
    if (!pageHeight) {
        return null;
    }
    return (
        <>
        <div className={s.container}>
            {lines.map((line, index) => (
                <Line key={index} events={line} pageHeight={pageHeight}/>
            ))}
        </div></>
    );
}