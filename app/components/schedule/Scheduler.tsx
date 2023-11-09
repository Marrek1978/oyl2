import moment from 'moment'
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from '@remix-run/react';
import type {  Task, ToDo, } from '@prisma/client';
import React, { useCallback, useMemo, } from 'react'
import { Calendar, momentLocalizer, Views, } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import { useGetLoadedDesiresWithAll, useGetLoadedLists, useGetLoadedRoutines } from '~/routes/dash.schedule';

import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndTasks } from '~/types/routineTypes'
import type { OutcomeWithAll, OutcomeWithAllWithStringDates } from '~/types/outcomeTypes';
import type { DesireWithOutcomesAndAll, DesireWithOutcomesAndAllWithStrDates } from '~/types/desireTypes';
import type { DragFromOutsideItemArgs, EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'
import type { AllDraggedItems, AllScheduleItems, DroppedItem, ScheduleItemNotYetSaved } from '~/types/schedulerTypes';


const localizer = momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop(Calendar)


interface SchedulerProps {
  scheduleItems: AllScheduleItems[];
  setScheduleItems: React.Dispatch<React.SetStateAction<AllScheduleItems[]>>;
  draggedItem: AllDraggedItems;
  setDraggedItem: React.Dispatch<React.SetStateAction<AllDraggedItems>>;
  setIsSaveScheduledItems: React.Dispatch<React.SetStateAction<boolean>>;
  isSaveScheduledItems?: boolean;
}



function Scheduler({
  scheduleItems,
  setScheduleItems,
  draggedItem,
  setDraggedItem,
  setIsSaveScheduledItems,
  isSaveScheduledItems,
}: SchedulerProps) {

  let navigate = useNavigate();

  const defaultDate = useMemo(() => new Date(), [])
  const desiresAndAll = useGetLoadedDesiresWithAll()
  const mainFocusOutcomeId = useGetMainFocusOutcomeId(desiresAndAll);

  const miscAndSpecialLists = useGetLoadedLists()
  const miscAndSpecialRoutines = useGetLoadedRoutines()
  const desiresAndOutcomesAndLists = useGetLoadedDesiresWithAll()


  
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


  const addNewItemToSchedule = useCallback((list: ScheduleItemNotYetSaved): void => {
    setIsSaveScheduledItems(true)
    setScheduleItems((prev) => {
      return [...prev, { ...list }]
    })
  }, [setScheduleItems, setIsSaveScheduledItems])


  const onDrdopFromOutside = useCallback(({ start: startDate, end: endDate }: DragFromOutsideItemArgs) => {
    if (draggedItem === undefined) return
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    let description = {};
    if ('desireId' in draggedItem) {
      const isMainFocus = draggedItem.id === mainFocusOutcomeId;
      (description = { type: 'timeblock', isMainFocus: isMainFocus, desireId: draggedItem.desireId, outcomeId: draggedItem.id })
    }
    if ('outcomeId' in draggedItem && draggedItem.outcomeId !== null) {
      const isMainFocus = draggedItem.outcomeId === mainFocusOutcomeId;
      if ('todos' in draggedItem) { (description = { type: 'outcome', isMainFocus: isMainFocus, subType: 'list', outcomeId: draggedItem.outcomeId, itemId: draggedItem.id }) }
      if ('tasks' in draggedItem) { (description = { type: 'outcome', isMainFocus: isMainFocus, subType: 'routine', outcomeId: draggedItem.outcomeId, itemId: draggedItem.id }) }
    }

    'outcomeId' in draggedItem && draggedItem.outcomeId === null && 'todos' in draggedItem && (description = { type: 'list', listId: draggedItem.id })
    'outcomeId' in draggedItem && draggedItem.outcomeId === null && 'tasks' in draggedItem && (description = { type: 'routine', routineId: draggedItem.id })

    const droppedItem: DroppedItem = {
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
  }, [draggedItem, setDraggedItem, addNewItemToSchedule, mainFocusOutcomeId])


  const moveEvent = useCallback(({ event, start, end, isAllDay: droppedOnAllDaySlot = false }: EventInteractionArgs<any>): void => {
    const { allDay } = event
    if (!allDay && droppedOnAllDaySlot) event.allDay = true

    setScheduleItems((prev) => {
      const existing = prev.find((ev) => ev.id === event.id)!
      const filtered = prev.filter((ev) => ev.id !== event.id)
      const newStart = typeof start === 'string' ? new Date(start) : start;
      const newEnd = typeof end === 'string' ? new Date(end) : end;
      return [...filtered, { ...existing, start: newStart, end: newEnd, allDay, id: existing.id, title: existing.title }]
    })
  }, [setScheduleItems])


  const resizeEvent = useCallback((
    { event, start, end }: EventInteractionArgs<any>
  ): void => {
    setIsSaveScheduledItems(true)
    setScheduleItems((prev) => {
      const existing = prev.find((ev) => ev.id === event.id)!
      const filtered = prev.filter((ev) => ev.id !== event.id)
      const newStart = typeof start === 'string' ? new Date(start) : start;
      const newEnd = typeof end === 'string' ? new Date(end) : end;
      return [...filtered, { ...existing, start: newStart, end: newEnd }]
    })
  }, [setScheduleItems, setIsSaveScheduledItems])


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
    //!description is available on innerEvent
    //add Timeblock, List, Routine, Outcome, Desire
    // color coding here
    console.log("🚀 ~ file: Scheduler.tsx:162 ~ CustomEvent ~ event:", innerEvent)
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
      //! condidional classnames here?
      return { className: 'bg-primary-content text-base-content' }  // colors scheduled events
    }, [])


  // function handleOnSelectEvent({ event: Object }: any) {
  //   console.log('in handle select list')
  // }


  function handleDoubleClickEvent(
    event: any,
    e: React.SyntheticEvent<HTMLElement, Event>
  ) {
    if (event.id.includes('-')) {
      setScheduleItems((prev) => {
        const filtered = prev.filter((ev) => ev.id !== event.id)
        return [...filtered]
      })
    } else {
      navigate(`/dash/schedule/${event.id}`, { state: { scheduleItemsState: scheduleItems } });
    }
  }


  function handleToolTipAccessor(event: any) {
    const description = event.description
    console.log("🚀 ~ file: Scheduler.tsx:216 ~ handleToolTipAccessor ~ description:", description)
    const type = description.type
    let toolTipHeaderText = 'To-Dos'
    let outcomeName: string;

    let loadedLists: ListAndToDos[] | RoutineAndTasks[] | DesireWithOutcomesAndAll[] = [];
    let currentList: ListAndToDos[] | RoutineAndTasks[] | undefined;
    let currentToDos: ToDo[] | Task[] | undefined;

    if (type === 'list') {
      loadedLists = miscAndSpecialLists as ListAndToDos[]
      currentList = loadedLists?.filter((list: ListAndToDos) => list.id === description.listId) as ListAndToDos[]
      currentList && (currentToDos = currentList[0]?.['todos'])
    }

    if (type === 'routine') {
      loadedLists = miscAndSpecialRoutines as RoutineAndTasks[]
      currentList = loadedLists?.filter((list: RoutineAndTasks) => list.id === description.routineId) as RoutineAndTasks[]
      currentList && (currentToDos = currentList[0]?.['tasks'])
      toolTipHeaderText = 'Tasks'
    }

    if (type === 'outcome') {
      loadedLists = desiresAndOutcomesAndLists as DesireWithOutcomesAndAll[]

      if (description.subType === 'list') {
        const outcome = loadedLists?.flatMap((desire) =>
          desire.outcomes.filter((outcome) => outcome.id === description.outcomeId));
        const list = outcome[0].lists.filter((list) => list.id === description.itemId) as ListAndToDos[]
        currentList = list
        currentList && (currentToDos = currentList[0]?.['todos'])
        outcomeName = outcome[0].title
        toolTipHeaderText = `To-Dos\nfor Outcome: ${outcomeName}`
      }

      if (description.subType === 'routine') {
        const outcome = loadedLists?.flatMap((desire) =>
          desire.outcomes.filter((outcome) => outcome.id === description.outcomeId));
        const routine = outcome[0].routines.filter((routine) => routine.id === description.itemId) as RoutineAndTasks[]
        currentList = routine
        currentList && (currentToDos = currentList[0]?.['tasks'])
        outcomeName = outcome[0].title
        toolTipHeaderText = `Tasks\nfor Outcome: ${outcomeName}`
      }

      return `\n${toolTipHeaderText}: \n  ${currentToDos?.map((todo: any) => todo.body).join('\n  ')} `
    }

    if (type === 'timeblock') {
      loadedLists = desiresAndAll as DesireWithOutcomesAndAll[]
      const outcome = loadedLists?.flatMap((desire) =>
      desire.outcomes.filter((outcome) => outcome.id === description.outcomeId)) as OutcomeWithAll[]
      outcomeName = outcome[0].title
      currentList = outcome[0].lists
      toolTipHeaderText=`Timeblock for Outcome: \n${outcomeName}`
     
      return `\n${toolTipHeaderText}:` +
        `\nTo-Do Lists` +
        ` ${currentList?.map((todo: any) => {
          const listTitle = todo.title
          const todos = todo.todos.map((todo: any) => {
            return (`${todo.body}`)
          })
          return (`\n  ${listTitle}\n      ${todos}`)
        }).join('')}  `
    }

    return `\n${toolTipHeaderText}: \n  ${currentToDos?.map((todo: any) => todo.body).join('\n  ')} `
  }



  return (
    <>

      <div className="h-[600px]">
        <DragAndDropCalendar
          defaultDate={defaultDate}
          defaultView={Views.WEEK}
          dragFromOutsideItem={dragFromOutsideItem}
          events={scheduleItems}
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


function useGetMainFocusOutcomeId(desiresAndAllArray: DesireWithOutcomesAndAllWithStrDates[]) {
  return useMemo(() => {
    const desireZero = desiresAndAllArray.find((desire: DesireWithOutcomesAndAllWithStrDates) => desire.sortOrder === 0);
    if (!desireZero) return '';
    const outcomeZero = desireZero.outcomes.find((outcome: OutcomeWithAllWithStringDates) => outcome.sortOrder === 0);
    return outcomeZero ? outcomeZero.id : '';
  }, [desiresAndAllArray]);
}

