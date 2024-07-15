import s from './CalendarEvent.module.css';
import {ProcessedEvent} from "../../types/Event";

type Props = {
    column: Array<ProcessedEvent>,
    event: ProcessedEvent,
    pageHeight: number,
    earlyEventStartMinute: number
}

// find all events before current event (in current line) to calculate delta minutes
const getDeltaMinutesPreviousEvents = (column: Array<ProcessedEvent>, event: ProcessedEvent, earlyEventStartMinute: number) => {
    return column.reduce((acc, previousEvent) => {
        if (previousEvent.startDate >= event.startDate) {
            return acc;
        }
        return acc + (((previousEvent.endDate.getHours() - 9) * 60 + previousEvent.endDate.getMinutes()) - earlyEventStartMinute);
    }, 0);
}

export const CalendarEvent = ({event, pageHeight, column, earlyEventStartMinute}: Props) => {
    const deltaMinutesPreviousEvents = getDeltaMinutesPreviousEvents(column, event, earlyEventStartMinute);

    const startMinutes = ((event.startDate.getHours() - 9) * 60 + event.startDate.getMinutes()) - earlyEventStartMinute - deltaMinutesPreviousEvents;
    const heightForOneMinute = (pageHeight / 12) / 60;
    return (<div className={s.event} style={{
        height: `${event.duration * heightForOneMinute}px`, marginTop: `${(startMinutes) * heightForOneMinute}px`,
    }}>
        <span className={s.content}>{event.id}, {event.start} {event.duration}min</span>
    </div>);
}