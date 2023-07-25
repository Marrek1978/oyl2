import React, { useCallback, useMemo, useState } from 'react'

// import type { SlotInfo } from 'react-big-calendar'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import { Calendar, momentLocalizer, Views, } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import type { EventInteractionArgs, DragFromOutsideItemArgs } from 'react-big-calendar/lib/addons/dragAndDrop'

import moment from 'moment'
import { v4 as uuidv4 } from 'uuid';

import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndToDos } from '~/types/routineTypes'
import type { ScheduledList } from '@prisma/client'
import Modal from '../modals/Modal'
import DeleteEventModal from '../modals/DeleteEventModal'
import SuccessMessage from '../modals/SuccessMessage'
// import { events } from './../calendar/events/events';

const localizer = momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop(Calendar)

interface SchedulerProps {
  scheduledLists: ScheduledList[] | Omit<ScheduledList, 'createdAt' | 'updatedAt' | 'userId'>[];
  setScheduledLists: React.Dispatch<React.SetStateAction<ScheduledList[] | Omit<ScheduledList, 'createdAt' | 'updatedAt' | 'userId'>[]>>;
  draggedList: ListAndToDos | RoutineAndToDos | undefined;
  setDraggedList: React.Dispatch<React.SetStateAction<ListAndToDos | RoutineAndToDos | undefined>>;
  setSaveScheduledLists: React.Dispatch<React.SetStateAction<boolean>>;
  // saveScheduledLists: boolean;
  loadedToDos: ListAndToDos[];
  loadedRoutines: RoutineAndToDos[];
}

//!  have to decide on styling

function Scheduler({
  scheduledLists,
  setScheduledLists,
  draggedList,
  setDraggedList,
  setSaveScheduledLists,
  // saveScheduledLists, 
  loadedToDos,
  loadedRoutines,
}: SchedulerProps) {

  const defaultDate = useMemo(() => new Date(), [])
  const [deleteEventBool, setDeleteEventBool] = useState<boolean>(false)
  const [successMessage, setSuccessMessage] = useState('');
  const [eventToDelete, setEventToDelete] = useState<ScheduledList | Omit<ScheduledList, 'createdAt' | 'updatedAt' | 'userId'>>()

  // console.log('in scheduler and loadedToDos is ', loadedToDos)


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


  const addListToScheduledList = useCallback((list: Omit<ScheduledList, 'createdAt' | 'updatedAt' | 'userId'>): void => {
    setSaveScheduledLists(true)
    setScheduledLists((prev) => {
      return [...prev, { ...list }]
    })
  }, [setScheduledLists, setSaveScheduledLists])


  const onDrdopFromOutside = useCallback((
    { start: startDate, end: endDate }: DragFromOutsideItemArgs
  ) => {

    if (draggedList === undefined) return
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    const description: { [key: string]: string } = descriptionTypeLabelAndId(draggedList!)

    // randome id is needed to create a new scheduled list
    // if id is in db => update
    // if this id is not in DB ( adn won't be) => create new scheduled list with DB givin ID
    const list: Omit<ScheduledList, 'createdAt' | 'updatedAt' | 'userId'> = {
      id: uuidv4(),
      listId: draggedList.id,
      title: draggedList.title,
      isDraggable: true,
      start,
      end,
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
    //  could get todos from description : listId?  access it here to display todos?
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

    // list todos??
  }

  const eventPropGetter = useCallback(
    (event: object) => {
      // console.log('in event prop getter and event is ', event)
      // make bg based on descripton type
      return { className: 'bg-primary-content text-base-content' }  // colors scheduled events
    }, [])


  // function handleOnSelectEvent({ event: Object }: any) {
  //   console.log('in handle select list')
  // }

  function handleDoubleClickEvent(
    event: any,
    e: React.SyntheticEvent<HTMLElement, Event>
  ) {
    setDeleteEventBool(true)
    setEventToDelete(event as ScheduledList | Omit<ScheduledList, 'createdAt' | 'updatedAt' | 'userId'>)
  }

  function handleToolTipAccessor(event: any) {

    const type = Object.keys(event.description)[0]
    const { listId } = event
    let loadedList: ListAndToDos[] | RoutineAndToDos[] = [];
    let todosArrayName: string = '';

    if (type === 'todos') {
      loadedList = loadedToDos
      todosArrayName = type
    }
    if (type === 'routineToDos') {
      loadedList = loadedRoutines
      todosArrayName = type
    }

    const currentList = loadedList?.filter((list) => list.id === listId)
    const currentToDos = currentList[0][todosArrayName]

    return `\nToDos:\n${currentToDos?.map((todo: any) => todo.body).join('\n')}`
  }

  return (
    <>

      {successMessage && (
        <Modal onClose={() => { }} zIndex={30}>
          {successMessage}Yolo
          <SuccessMessage
            // text={isEditingTodoList ? 'Routine was saved' : 'Routine was updated'}
            text='List was removed from Schedule'
          />
        </Modal>)
      }


      {deleteEventBool && eventToDelete && (
        <Modal onClose={() => { }} zIndex={20}>
          <DeleteEventModal
            event={eventToDelete}
            setDeleteEventBool={setDeleteEventBool}
            setScheduledLists={setScheduledLists}
            setSuccessMessage={setSuccessMessage}
          />
        </Modal>
      )}

      <div className="h-[600px]">
        <DragAndDropCalendar
          defaultDate={defaultDate}
          defaultView={Views.WEEK}
          dragFromOutsideItem={dragFromOutsideItem}
          events={scheduledLists}
          localizer={localizer}
          onDropFromOutside={onDrdopFromOutside}
          onDragOver={customOnDragOver}
          onEventDrop={moveEvent}
          onEventResize={resizeEvent}
          resizable
          selectable
          toolbar={false}
          scrollToTime={new Date()}
          dayPropGetter={dayPropGetter}
          eventPropGetter={eventPropGetter}
          components={{
            event: CustomEvent,
          }}
          step={15}
          timeslots={4}
          onDrillDown={() => { }}
          // onSelectEvent={handleOnSelectEvent}
          onDoubleClickEvent={handleDoubleClickEvent}
          tooltipAccessor={handleToolTipAccessor}

        />
      </div>
    </>
  )
}

export default Scheduler


function descriptionTypeLabelAndId(list: ListAndToDos | RoutineAndToDos): { [key: string]: string } {
  if ('todos' in list) {
    return { todos: list.id }
  } else if ('routineToDos' in list) {
    return { routineToDos: list.id }
  } else {
    return {}
  }
}