import moment from 'moment'
import { v4 as uuidv4 } from 'uuid';
import React, { useCallback, useMemo, useState } from 'react'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import Modal from '~/components/modals/Modal'
import SuccessMessage from '~/components/modals/SuccessMessage'
import DeleteEventModal from '~/components/modals/DeleteEventModal'
import { Calendar, momentLocalizer, Views, } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndTasks } from '~/types/routineTypes'
import type { OutcomeWithAll } from '~/types/outcomeTypes';
import type { EventInteractionArgs, DragFromOutsideItemArgs } from 'react-big-calendar/lib/addons/dragAndDrop'
import type { ScheduledItem } from '@prisma/client';

const localizer = momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop(Calendar)


interface SchedulerProps {
  scheduledItems: ScheduledItem[] | Omit<ScheduledItem, 'createdAt' | 'updatedAt' | 'userId'>[];
  setScheduledItems: React.Dispatch<React.SetStateAction<ScheduledItem[] | Omit<ScheduledItem, 'createdAt' | 'updatedAt' | 'userId'>[]>>;
  draggedItem: ListAndToDos | RoutineAndTasks | OutcomeWithAll |  undefined;
  setDraggedItem: React.Dispatch<React.SetStateAction<ListAndToDos | RoutineAndTasks | OutcomeWithAll |  undefined>>;
  setIsSaveScheduledItems: React.Dispatch<React.SetStateAction<boolean>>;
  isSaveScheduledItems?: boolean;
}



function Scheduler({
  scheduledItems,
  setScheduledItems,
  draggedItem,
  setDraggedItem,
  setIsSaveScheduledItems,
  isSaveScheduledItems,
}: SchedulerProps) {

  const defaultDate = useMemo(() => new Date(), [])
  const [deleteEventBool, setDeleteEventBool] = useState<boolean>(false)
  const [successMessage, setSuccessMessage] = useState('');
  const [eventToDelete, setEventToDelete] = useState<ScheduledItem | Omit<ScheduledItem, 'createdAt' | 'updatedAt' | 'userId'>>()


  //? ***********   CUSTOM DragAndDropCalendar FUNCTIONS   ***************** */
  const dragFromOutsideItem = useCallback(() => {
    return (event: object) => {
      if (draggedItem !== undefined) return new Date();
      return new Date(0)
    }
  }, [draggedItem])


  const customOnDragOver = useCallback(
    (dragEvent: React.DragEvent<Element>) => {
      dragEvent.preventDefault()
    }, [])


  //!can save even when liste is not dropped onto calendar
  const addNewItemToSchedule = useCallback((list: Omit<ScheduledItem, 'createdAt' | 'updatedAt' | 'userId'>): void => {
    setIsSaveScheduledItems(true)
    setScheduledItems((prev) => {
      return [...prev, { ...list }]
    })
  }, [setScheduledItems, setIsSaveScheduledItems])


  const onDrdopFromOutside = useCallback(({ start: startDate, end: endDate }: DragFromOutsideItemArgs) => {
    if (draggedItem === undefined) return

    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    let description = {};

    'todos' in draggedItem && (description = { listId: draggedItem.id })
    'tasks' in draggedItem && (description = { routineId: draggedItem.id })
    'lists' in draggedItem && (description = { outcomeId: draggedItem.id })


    const droppedItem: Omit<ScheduledItem, 'createdAt' | 'updatedAt' | 'userId' | 'description' & { description: string }> = {
      id: uuidv4(),
      itemId: draggedItem.id,
      title: draggedItem.title,
      isDraggable: true,
      start,
      end,
      description: description,
    }

    setDraggedItem(undefined)
    addNewItemToSchedule(droppedItem)

  }, [draggedItem, setDraggedItem, addNewItemToSchedule])


  const moveEvent = useCallback(({ event, start, end, isAllDay: droppedOnAllDaySlot = false }: EventInteractionArgs<any>): void => {
    const { allDay } = event
    if (!allDay && droppedOnAllDaySlot) event.allDay = true

    setScheduledItems((prev) => {
      const existing = prev.find((ev) => ev.id === event.id)!
      const filtered = prev.filter((ev) => ev.id !== event.id)
      const newStart = typeof start === 'string' ? new Date(start) : start;
      const newEnd = typeof end === 'string' ? new Date(end) : end;
      return [...filtered, { ...existing, start: newStart, end: newEnd, allDay, id: existing.id, title: existing.title }]
    })
  }, [setScheduledItems])


  const resizeEvent = useCallback((
    { event, start, end }: EventInteractionArgs<any>
  ): void => {
    setIsSaveScheduledItems(true)
    setScheduledItems((prev) => {
      const existing = prev.find((ev) => ev.id === event.id)!
      const filtered = prev.filter((ev) => ev.id !== event.id)
      const newStart = typeof start === 'string' ? new Date(start) : start;
      const newEnd = typeof end === 'string' ? new Date(end) : end;
      return [...filtered, { ...existing, start: newStart, end: newEnd }]
    })
  }, [setScheduledItems, setIsSaveScheduledItems])


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


  //  could get todos from description : listId?  access it here to display todos?
  function CustomEvent({ event: innerEvent, title }: any) {
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
    setEventToDelete(event as ScheduledItem | Omit<ScheduledItem, 'createdAt' | 'updatedAt' | 'userId'>)
  }


  function handleToolTipAccessor(event: any) {
    const type = Object.keys(event.description)[0]
    // const { listId } = event
    // let loadedList: ListAndToDos[] | RoutineAndTasks[] = [];
    // let currentList: ListAndToDos[] | RoutineAndTasks[] | undefined;
    // let currentToDos: ToDo[] | Task[] | undefined;

    // if (type === 'todos') {
    //   loadedList = loadedToDos
    //   currentList = loadedList?.filter((list: ListAndToDos) => list.id === listId);
    //   currentList && (currentToDos = currentList[0]?.[type])
    // }

    // if (type === 'RoutineAndTasks') {
    //   loadedList = loadedRoutines
    //   currentList = loadedList?.filter((list: RoutineAndTasks) => list.id === listId);
    //   currentList && (currentToDos = currentList[0]?.[type])
    // }

    // if (type === 'projectLists') {
    //   const titles = event.description[type].map((list: ListAndToDos) => list.title)
    //   return `\nLists:\n${titles.join('\n')}`
    // }

    return `Tool Tip Accessor ${type}`
    // return `\nToDos:\n${currentToDos?.map((todo: any) => todo.body).join('\n')}`
  }



  return (
    <>
      {successMessage && (
        <Modal onClose={() => { }} zIndex={30}>
          {successMessage}Yolo
          <SuccessMessage
            text='List was removed from Schedule'
          />
        </Modal>)
      }

      {deleteEventBool && eventToDelete && (
        <Modal onClose={() => { }} zIndex={20}>
          <DeleteEventModal
            event={eventToDelete}
            setDeleteEventBool={setDeleteEventBool}
            setScheduledLists={setScheduledItems}
            setSuccessMessage={setSuccessMessage}
          />
        </Modal>
      )}

      <div className="h-[600px]">
        <DragAndDropCalendar
          defaultDate={defaultDate}
          defaultView={Views.WEEK}
          dragFromOutsideItem={dragFromOutsideItem}
          events={scheduledItems}
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



