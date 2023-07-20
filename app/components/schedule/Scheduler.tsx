import React, { useCallback, useMemo } from 'react'

// import type { SlotInfo } from 'react-big-calendar'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import { Calendar, momentLocalizer, Views, } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import type { EventInteractionArgs, DragFromOutsideItemArgs } from 'react-big-calendar/lib/addons/dragAndDrop'

import moment from 'moment'
import { v4 as uuidv4 } from 'uuid';

import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndToDos } from '~/types/routineTypes'
// import { events } from './../calendar/events/events';

const localizer = momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop(Calendar)

// interface myEvent extends Event {
//   id: number;
//   title?: string;
//   start: Date;
//   end: Date;
//   isDraggable?: boolean;
//   allDay?: boolean;
//   description?: string;
//   resource?: any;
// }

interface ScheduledList {
  id: string; // unique
  listId: string, // from list/routine  
  title?: string | undefined;
  start: Date;
  end: Date;
  isDraggable: boolean;
  allDay?: boolean;
  description?: { [key: string]: string };
}

interface SchedulerProps {
  scheduledLists: ScheduledList[];
  setScheduledLists: React.Dispatch<React.SetStateAction<ScheduledList[]>>;
  draggedList: ListAndToDos | RoutineAndToDos | undefined;
  setDraggedList: React.Dispatch<React.SetStateAction<ListAndToDos | RoutineAndToDos | undefined>>;
  saveScheduledLists: boolean;
  setSaveScheduledLists: React.Dispatch<React.SetStateAction<boolean>>;
}

function Scheduler({ scheduledLists, setScheduledLists, draggedList, setDraggedList, saveScheduledLists, setSaveScheduledLists }: SchedulerProps) {

  const defaultDate = useMemo(() => new Date(), [])


  const eventPropGetter = useCallback(
    (event: object) => {
      return { className: 'bg-primary-content text-base-content' }  // colors scheduled events
    }, [])


  const dragFromOutsideItem = useCallback(() => {
    return (event: object) => {
      if (draggedList !== undefined) return new Date();
      return new Date(0)
    }
  }, [draggedList])


  const customOnDragOver = useCallback(
    (dragEvent: React.DragEvent<Element>) => {
      dragEvent.preventDefault()
    }, [])


  const addListToScheduledList = useCallback((list: ScheduledList): void => {
    setSaveScheduledLists(true)
    setScheduledLists((prev) => {
      return [...prev, { ...list }]
    })
  }, [setScheduledLists, setSaveScheduledLists])


  // const onSelectSlot = useCallback((slotInfo: SlotInfo) => {

  //   console.log('slotInfo', slotInfo)
  //   const description: Todo[] | RoutineToDo[] = descriptionType(draggedEvent!)
  //   const newEvent: ConvertedToEvent = {
  //     id: uuidv4(),
  //     listId: draggedEvent!.id,
  //     title: draggedEvent?.title,
  //     start: slotInfo.start,
  //     end: slotInfo.end,
  //     isDraggable: true,
  //     allDay: false,
  //     description: description,
  //   }
  //   addEventToScheduledEvents(newEvent)
  // }, [addEventToScheduledEvents, draggedEvent])


  const onDrdopFromOutside = useCallback((
    { start: startDate, end: endDate }: DragFromOutsideItemArgs
  ) => {
    // console.log('onDropFromOutside')
    if (draggedList === undefined) return
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    //go from determining type to proving type lable and list id
    // const description: Todo[] | RoutineToDo[] = descriptionType(draggedList!)
    const description: { [key: string]: string } = descriptionTypeLabelAndId(draggedList!)

    const list: ScheduledList = {
      id: uuidv4(),
      listId: draggedList.id,
      title: draggedList.title,
      start,
      end,
      isDraggable: true,
      allDay: false,
      description: description,
    }

    setDraggedList(undefined)
    addListToScheduledList(list)
  }, [draggedList, setDraggedList, addListToScheduledList])


  const moveEvent = useCallback((
    { event, start, end, isAllDay: droppedOnAllDaySlot = false }: EventInteractionArgs<any>
  ): void => {
    const { allDay } = event
    if (!allDay && droppedOnAllDaySlot) event.allDay = true

    setSaveScheduledLists(true)
    setScheduledLists((prev) => {
      const existing = prev.find((ev) => ev.id === event.id)!
      const filtered = prev.filter((ev) => ev.id !== event.id)
      const newStart = typeof start === 'string' ? new Date(start) : start;
      const newEnd = typeof end === 'string' ? new Date(end) : end;

      return [...filtered, { ...existing, start: newStart, end: newEnd, allDay, id: existing.id, title: existing.title }]
    })
  }, [setScheduledLists, setSaveScheduledLists])


  const resizeEvent = useCallback((
    { event, start, end }: EventInteractionArgs<any>
  ): void => {
    setSaveScheduledLists(true)
    setScheduledLists((prev) => {
      const existing = prev.find((ev) => ev.id === event.id)!
      const filtered = prev.filter((ev) => ev.id !== event.id)
      const newStart = typeof start === 'string' ? new Date(start) : start;
      const newEnd = typeof end === 'string' ? new Date(end) : end;
      return [...filtered, { ...existing, start: newStart, end: newEnd }]
    })
  }, [setScheduledLists, setSaveScheduledLists])


  //? ***********   CUSTOM PROPS   ***************** */
  const dayPropGetter = useCallback((date: Date) => {
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return {
        className: 'bg-primary/50'
      };
    }
    return {};
  }, []);

  function CustomEvent({ event: innerEvent, title }: any) {
    //  could get lists from ids?  pass listId as description? and access it here to display todos?
    // description prob needs to be an array { type: listId, } to get todos[] - maybe just in day view?
    // console.log('innerEvent', innerEvent)
    return (
      <>
        {title && (
          <div className='font-medium'>{title}</div>
        )}
        <div className='text-xs'>
          {innerEvent.start && innerEvent.end ?
            `${innerEvent.start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${innerEvent.end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
            : 'No start and end times available'
          }
        </div>
      </>
    );
  }


  return (
    <>
      <div className="h-[600px]">
        <DragAndDropCalendar
          defaultDate={defaultDate}
          defaultView={Views.WEEK}
          dragFromOutsideItem={dragFromOutsideItem}
          // draggableAccessor={(event: any) => event.isDraggable}
          eventPropGetter={eventPropGetter}
          events={scheduledLists}
          localizer={localizer}
          onDropFromOutside={onDrdopFromOutside}
          onDragOver={customOnDragOver}
          onEventDrop={moveEvent}
          onEventResize={resizeEvent}
          // onSelectSlot={onSelectSlot}
          resizable
          selectable
          toolbar={false}
          scrollToTime={new Date()}
          dayPropGetter={dayPropGetter}
          components={{ event: CustomEvent }}
          step={15}
          timeslots={4}
        />
      </div>
    </>
  )
}

export default Scheduler

// function descriptionType(list: ListAndToDos | RoutineAndToDos): Todo[] | RoutineToDo[] {
//   if ('todos' in list) {
//     return list.todos
//   } else if ('routineToDos' in list) {
//     return list.routineToDos
//   } else {
//     return []
//   }
// }

function descriptionTypeLabelAndId(list: ListAndToDos | RoutineAndToDos): { [key: string]: string } {
  if ('todos' in list) {
    return { todos: list.id }
  } else if ('routineToDos' in list) {
    return { routineToDos: list.id }
  } else {
    return {}
  }
}