import React, { useCallback, useMemo, useState } from 'react'
import { Calendar, momentLocalizer, Views, DateLocalizer } from 'react-big-calendar'
import type { Event } from 'react-big-calendar'
// EventProps } from 'react-big-calendar'
import moment from 'moment'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import type { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import PropTypes from 'prop-types'

import events from '~/components/Calendar/events/events'

const localizer = momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop(Calendar)


//*  set up dnd from outside calendar
// * set up object shapes for importing todos/habits, etc, convert to events, for dnd
// * set up dnd from outside calendar
//* set up db for saving events 
//* consider how to structure and sync saved events vs converted events


interface myEvent extends Event {
  id: number;
}

//!  events will eventually come from lists/todos/habits, etc... and be converted to draggable events
// const events: myEvent[] = [
//   {
//     id: 0,
//     title: 'Board meeting',
//     start: new Date(2018, 0, 29, 9, 0, 0),
//     end: new Date(2018, 0, 29, 13, 0, 0),
//     resource: [1],
//   },
//   {
//     id: 1,
//     title: 'MS training',
//     allDay: true,
//     start: new Date(2018, 0, 29, 14, 0, 0),
//     end: new Date(2018, 0, 29, 16, 30, 0),
//     resource: [2],
//   },
//   {
//     id: 2,
//     title: 'Team lead meeting',
//     start: new Date(2018, 0, 29, 8, 30, 0),
//     end: new Date(2018, 0, 29, 12, 30, 0),
//     resource: [2, 3],
//   },
//   {
//     id: 11,
//     title: 'Birthday Party',
//     start: new Date(2018, 0, 30, 7, 0, 0),
//     end: new Date(2018, 0, 30, 10, 30, 0),
//     resource: [4],
//   },
// ]

function Schedule() {

  const [myEvents, setMyEvents] = useState<myEvent[]>(events)
  const defaultDate = useMemo(() => new Date(2015, 3, 12), [])

  const moveEvent = useCallback((
    { event, start, end, isAllDay: droppedOnAllDaySlot }: EventInteractionArgs<any>
  ): void => {

    const { allDay } = event
    if (!allDay && droppedOnAllDaySlot) event.allDay = true

    setMyEvents((prev) => {
      const existing = prev.find((ev) => ev.id === event.id)!
      const filtered = prev.filter((ev) => ev.id !== event.id)

      const newStart = typeof start === 'string' ? new Date(start) : start;
      const newEnd = typeof end === 'string' ? new Date(end) : end;

      return [...filtered, { ...existing, start: newStart, end: newEnd, allDay, id: existing.id, title: existing.title, resource: existing.resource }]
    })
  }, [setMyEvents])


  const resizeEvent = useCallback((
    { event, start, end }: EventInteractionArgs<any>
  ): void => {

    setMyEvents((prev) => {
      const existing = prev.find((ev) => ev.id === event.id)!
      const filtered = prev.filter((ev) => ev.id !== event.id)

      const newStart = typeof start === 'string' ? new Date(start) : start;
      const newEnd = typeof end === 'string' ? new Date(end) : end;

      return [...filtered, { ...existing, start: newStart, end: newEnd }]
    })
  }, [setMyEvents])

  // console.log('events are', myEvents)

  return (
    <>
      <strong>
        Drag and Drop an "event" from one slot to another to "move" the event,
        or drag an event's drag handles to "resize" the event.
      </strong>
      <div className="h-[600px]">
        <DragAndDropCalendar
          defaultDate={defaultDate}
          defaultView={Views.MONTH}
          events={myEvents}
          localizer={localizer}
          onEventDrop={moveEvent}
          onEventResize={resizeEvent}
          popup
          resizable
        />
      </div>
    </>
  )
}
Schedule.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
}

export default Schedule

// const MyCalendar = ({ props }: any) => (

//   <div className="myCustomHeight">
//     <Calendar
//       localizer={localizer}
//       // events={myEventsList}
//       startAccessor="start"
//       endAccessor="end"
//     />
//   </div>
// )
// type Event = {
//   id: number;
//   title: string;
//   start: Date;
//   end: Date;
//   allDay?: boolean;
//   resourceId?: number[];
// };