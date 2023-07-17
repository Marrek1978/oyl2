import React, { useCallback, useMemo, useState } from 'react'
import { Calendar, momentLocalizer, Views, DateLocalizer } from 'react-big-calendar'
import type { Event } from 'react-big-calendar'
// EventProps } from 'react-big-calendar'
import moment from 'moment'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import type { EventInteractionArgs, DragFromOutsideItemArgs } from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import PropTypes from 'prop-types'

import events from '~/components/Calendar/events/events'

const localizer = momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop(Calendar)

//example from https://github.com/jquense/react-big-calendar/blob/master/stories/demos/exampleCode/dndOutsideSource.js

//* load events from db
// * set up object shapes for importing todos/habits, etc, convert to events, for dnd
//* remove non-essentials - formatName, counters, etc
//* set proper default date
//* whole isdraggable?? props, etc.
//* set up db for saving events 
//* consider how to structure and sync saved events vs converted events


//  type for events with id field
interface myEvent extends Event {
  id: number;
}

// interface draggableEvent extends Event {
//   isDraggable: boolean;
// }

type DragItem = { title: string; name: string; } | 'undroppable';
// export interface Event {
//   allDay?: boolean | undefined;
//   title?: React.ReactNode | undefined;
//   start?: Date | undefined;
//   end?: Date | undefined;
//   resource?: any;
// }

//!  events will eventually come from lists/todos/habits, etc... and be converted to draggable events
const adjEvents = events.map((event, index) => ({
  ...event,
  // isDraggable: index % 2 === 0,
  isDraggable: true,
}))

//label for draggable events
//!  titles will come from list of loaded data
const formatName = (name: string, count: number) => `${name} ID ${count}`



function Schedule() {

  const [myEvents, setMyEvents] = useState<myEvent[]>(adjEvents)
  const [draggedEvent, setDraggedEvent] = useState<DragItem>()
  // const [displayDragItemInCell, setDisplayDragItemInCell] = useState<boolean>(true)
  // const displayDragItemInCell = true

  const [counters, setCounters] = useState<{ [key: string]: number }>({ item1: 0, item2: 0 })

  const defaultDate = useMemo(() => new Date(2015, 3, 12), [])

  const eventPropGetter = useCallback(
    (event: object) => {
      if ('isDraggable' in event && event.isDraggable) {
        return { className: 'isDraggable' }
      } else {
        return { className: 'isNotDraggable' }
      }
    }, [])

  const handleDragStart = useCallback((draggedItem: DragItem) => setDraggedEvent(draggedItem), [])

  // const dragFromOutsideItem = useCallback(() => draggedEvent, [draggedEvent])
  const dragFromOutsideItem = useCallback(() => {
    return (event: object) => {
      if (draggedEvent !== 'undroppable' && draggedEvent !== undefined) {
        return new Date();
      }
      return new Date(0)
    }
  }, [draggedEvent])

  const customOnDragOver = useCallback(
    (dragEvent: React.DragEvent<Element>) => {
      if (draggedEvent !== 'undroppable') {
        console.log('preventDefault')
        dragEvent.preventDefault()
      }
    }, [draggedEvent])

  //!   could be fixed to true... no need for assoc. input
  // const handleDisplayDragItemInCell = useCallback(() => setDisplayDragItemInCell((prev) => !prev), [])

  const newEvent = useCallback((event: Event): void => {
    setMyEvents((prev) => {
      const idList = prev.map((item) => item.id)
      const newId = Math.max(...idList) + 1
      return [...prev, { ...event, id: newId, isDraggable: true }]
    })
  }, [setMyEvents])


  const onDrdopFromOutside = useCallback((
    { start: startDate, end: endDate, allDay: isAllDay = false }: DragFromOutsideItemArgs
  ) => {
    if (draggedEvent === undefined) return
    if (draggedEvent === 'undroppable') {
      setDraggedEvent(undefined)
      return
    }

    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    const { name } = draggedEvent
    const event = {
      title: formatName(name, counters[name]),
      start,
      end,
      isAllDay,
    }
    setDraggedEvent(undefined)
    setCounters((prev) => {
      const { [name]: count } = prev
      return {
        ...prev,
        [name]: count + 1,
      }
    })
    newEvent(event)

  }, [draggedEvent, counters, setDraggedEvent, setCounters, newEvent])


  const moveEvent = useCallback((
    { event, start, end, isAllDay: droppedOnAllDaySlot = false }: EventInteractionArgs<any>
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

      <div className='card' >
        <div className="inner">
          <h4>Outside Drag Sources</h4>
          <p>
            Lighter colored events, in the Calendar, have an `isDraggable` key
            of `false`.
          </p>
          {Object.entries(counters).map(([name, count]) => (
            <div
              draggable="true"
              className='border-2 border-gray-400 p-2 bg-slate-200'
              key={name}
              onDragStart={() =>
                handleDragStart({ title: formatName(name, count), name })
              }
            >
              {formatName(name, count)}
            </div>
          ))}
          <div
            draggable="true"
            onDragStart={() => handleDragStart('undroppable')}
          >
            Draggable but not for calendar.
          </div>
        </div>
      </div>
      <div className="h-[600px]">
        <DragAndDropCalendar
          defaultDate={defaultDate}
          defaultView={Views.WEEK}
          dragFromOutsideItem={dragFromOutsideItem}
          draggableAccessor={(event: any) => event.isDraggable}
          eventPropGetter={eventPropGetter}
          events={myEvents}
          localizer={localizer}
          onDropFromOutside={onDrdopFromOutside}
          onDragOver={customOnDragOver}
          onEventDrop={moveEvent}
          onEventResize={resizeEvent}
          onSelectSlot={newEvent}
          resizable
          selectable
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