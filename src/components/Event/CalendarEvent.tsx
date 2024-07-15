import s from './Event.module.css';
import {Event, ProcessedEvent} from "../../types/Event";


export const CalendarEvent = ({event, pageHeight }: {event: ProcessedEvent, pageHeight: number}) => {


        // 100% height = 12hours
    const heightForOneMinute = (pageHeight / 12) / 60;
    console.log(heightForOneMinute)

    const startMinutes = (event.startDate.getHours() - 9) * 60 + event.startDate.getMinutes();
    return (
                <div className={s.event} style={{
                    position: 'absolute',
                    height: `${event.duration * heightForOneMinute}px`,
                    marginTop: `${startMinutes * heightForOneMinute}px`,
                }}>
                    <span className={s.content}>{event.id}, {event.start} {event.duration}min</span>
                </div>
    );
}