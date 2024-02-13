import moment from 'moment'
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from '@remix-run/react';
import React, { useCallback, useMemo, } from 'react'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import { Calendar, momentLocalizer, Views, } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import { ArrayOfObjectsStrToDates } from '../utilities/helperFunctions';
import { useGetLoadedDesiresWithAll, useGetLoadedLists, useGetLoadedMiscAndSpecialLists, useGetLoadedRoutines } from '~/routes/dash.schedule';

import type { Task, ToDo, } from '@prisma/client';
import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndTasks } from '~/types/routineTypes'
import type { OutcomeWithAll, } from '~/types/outcomeTypes';
import type { DesireWithOutcomesAndAll } from '~/types/desireTypes';
import type { DragFromOutsideItemArgs, EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'
import type { AllDraggedItems, AllScheduleItems, DroppedItem, ScheduleItemNotYetSaved, Description } from '~/types/schedulerTypes';


const localizer = momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop(Calendar)




interface SchedulerProps {
  scheduleItems: AllScheduleItems[];
  setScheduleItems: React.Dispatch<React.SetStateAction<AllScheduleItems[]>>;
  draggedItem: AllDraggedItems;
  setDraggedItem: React.Dispatch<React.SetStateAction<AllDraggedItems>>;
  setIsSaveScheduledItems: React.Dispatch<React.SetStateAction<boolean>>;
}



function Scheduler({
  scheduleItems,
  setScheduleItems,
  draggedItem,
  setDraggedItem,
  setIsSaveScheduledItems,
}: SchedulerProps) {

  let navigate = useNavigate();

  const defaultDate = useMemo(() => new Date(), [])

  const miscAndSpecialLists = useGetLoadedLists()
  const desiresAndAll = useGetLoadedDesiresWithAll()
  const miscAndSpecialRoutines = useGetLoadedRoutines()
  const mainFocusOutcomeId = useGetMainFocusOutcomeId(desiresAndAll);

  const { miscLists, specialLists } = useGetLoadedMiscAndSpecialLists()

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




  // drop objects from outside
  //convert to dropped item
  // add to schedule
  //standardize description for tool tips


  const onDrdopFromOutside = useCallback(({ start: startDate, end: endDate }: DragFromOutsideItemArgs) => {
    if (draggedItem === undefined) return

    console.log(' dragged item is ', draggedItem)

    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    let description: Description = {};

    //? ***********   Outcome LISTS   ***************** */
    if ('desireId' in draggedItem) {
      const isMainFocus = draggedItem.id === mainFocusOutcomeId;
      description = { type: 'outcomeLists', isMainFocus: isMainFocus, desireId: draggedItem.desireId, outcomeId: draggedItem.id }
    }

    //? ***********   SPECIFIC LIST OR ROUTINES   ***************** */
    if ('outcomeId' in draggedItem && draggedItem.outcomeId !== null) {
      const isMainFocus = draggedItem.outcomeId === mainFocusOutcomeId;
      if ('todos' in draggedItem) { (description = { type: 'outcome', isMainFocus: isMainFocus, subType: 'list', outcomeId: draggedItem.outcomeId, itemId: draggedItem.id }) }
      if ('tasks' in draggedItem) { (description = { type: 'outcome', isMainFocus: isMainFocus, subType: 'routine', outcomeId: draggedItem.outcomeId, itemId: draggedItem.id }) }
    }

    'outcomeId' in draggedItem && draggedItem.outcomeId === null && 'todos' in draggedItem && (description = { type: 'list', listId: draggedItem.id })
    'outcomeId' in draggedItem && draggedItem.outcomeId === null && 'tasks' in draggedItem && (description = { type: 'routine', routineId: draggedItem.id })


    //? ***********   All MISC LISTS  ***************** */
    if ('name' in draggedItem && draggedItem.name === 'allMiscLists') {
      (description = { type: 'allMiscLists' })
    }

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
    return CreateToolTip({ event, miscAndSpecialLists, miscLists, miscAndSpecialRoutines, desiresAndAll })
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


function useGetMainFocusOutcomeId(desiresAndAllArray: DesireWithOutcomesAndAll[]): string {
  return useMemo(() => {
    const desireZero = desiresAndAllArray.find((desire: DesireWithOutcomesAndAll) => desire.sortOrder === 0);
    if (!desireZero) return '';
    const outcomes = ArrayOfObjectsStrToDates({ items: desireZero.outcomes, dateKeys: ['createdAt', 'updatedAt'] }) as OutcomeWithAll[]
    const outcomeZero = outcomes.find((outcome: OutcomeWithAll) => outcome.sortOrder === 0);
    return outcomeZero ? outcomeZero.id : '';
  }, [desiresAndAllArray]);
}


interface ToolTipType {
  event: any;
  miscAndSpecialLists: ListAndToDos[] | undefined;
  miscAndSpecialRoutines: RoutineAndTasks[] | undefined;
  desiresAndAll: DesireWithOutcomesAndAll[] | undefined;
  miscLists: ListAndToDos[] | undefined;
}


export function CreateToolTip({ event, miscAndSpecialLists, miscLists, miscAndSpecialRoutines, desiresAndAll }: ToolTipType): string {
  console.log("🚀 ~ CreateToolTip ~ miscAndSpecialLists:", miscAndSpecialLists)
  // console.log('create tool tip in scheudler')
  const description = event.description
  const type = description.type
  console.log("🚀 ~ CreateToolTip ~ type:", type)
  let toolTipHeaderText = ''
  let outcomeName: string;

  // let loadedLists: ListAndToDos[] | RoutineAndTasks[] | DesireWithOutcomesAndAll[] = [];
  let currentList: ListAndToDos | RoutineAndTasks | ListAndToDos[]
  let currentToDos: ToDo[] | Task[] = [];
  let itemTitle: string = '';

  if (type === 'list') {
    const lists = miscAndSpecialLists as ListAndToDos[]
    const listById = GetCurrentListById(description.listId, lists) as ListAndToDos[]
    if (listById.length === 0) return ' '
    currentList = listById[0]
    currentList && (currentToDos = currentList?.todos)
    itemTitle = currentList?.title
    toolTipHeaderText = `List: ${itemTitle} \nTo-Dos`
  }

  if (type === 'routine') {
    // console.log(' in routine')
    const routines = miscAndSpecialRoutines as RoutineAndTasks[]
    const routineById = GetCurrentListById(description.routineId, routines) as RoutineAndTasks[]
    if (routineById.length === 0) return ' '
    currentList = routineById[0]
    currentList && (currentToDos = currentList?.tasks)
    itemTitle = currentList?.title
    toolTipHeaderText = `Routine: ${itemTitle} \nTasks`
  }

  if (type === 'outcome') {
    // console.log('type = outcome')
    const lists = desiresAndAll as DesireWithOutcomesAndAll[]
    if (description.subType === 'list') {
      const outcomeById = GetOutcomeByIdFromDesiresArray(lists, description.outcomeId)
      if (outcomeById.length === 0) return ' '
      const outcome = outcomeById[0]
      currentList = GetCurrentListById(description.itemId, outcome.lists)[0] as ListAndToDos
      currentList && (currentToDos = currentList.todos)
      outcomeName = outcome.title
      itemTitle = currentList.title
      toolTipHeaderText = `${outcomeName}\nList: ${itemTitle}\nTo-Dos`
    }

    if (description.subType === 'routine') {
      const outcomeById = GetOutcomeByIdFromDesiresArray(lists, description.outcomeId)
      if (outcomeById.length === 0) return ' '
      const outcome = outcomeById[0]
      currentList = GetCurrentListById(description.itemId, outcome.routines)[0] as RoutineAndTasks
      currentList && (currentToDos = currentList?.tasks)
      outcomeName = outcome.title
      itemTitle = currentList?.['title']
      toolTipHeaderText = `${outcomeName}\nRoutine: ${itemTitle}\nTasks`
    }

    return `\n${toolTipHeaderText}: \n  ${currentToDos?.map((todo: any) => todo.body).join('\n  ')} `
  }

  if (type === 'outcomeLists') {
    const lists = desiresAndAll as DesireWithOutcomesAndAll[]
    const outcomeById = GetOutcomeByIdFromDesiresArray(lists, description.outcomeId)
    if (outcomeById.length === 0) return ' '
    const outcome = outcomeById[0]
    outcomeName = outcome.title
    currentList = outcome.lists
    toolTipHeaderText = `Timeblock for: \n${outcomeName}`


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


  if (type === 'allMiscLists') {
    const lists = miscLists as ListAndToDos[]
    toolTipHeaderText = `All Misc. Lists`

    return `\n${toolTipHeaderText}:` +
      `\nTo-Do Lists` +
      ` ${lists?.map((todo: any) => {
        const listTitle = todo.title
        const todos = todo.todos.map((todo: any) => {
          return (`${todo.body} `)
        })
        return (`\n  ${listTitle}\n      ${todos} \n`)
      }).join('')}  `
  }

  return `\n${toolTipHeaderText}: \n  ${currentToDos?.map((todo: any) => todo.body).join('\n  ')} `
}


export function GetOutcomeByIdFromDesiresArray(desiresAndAll: DesireWithOutcomesAndAll[], id: string) {
  const result = desiresAndAll?.flatMap((desire) =>
    desire.outcomes.filter((outcome) => outcome.id === id));
  return result
}


export function GetCurrentListById(id: string, array: any) {
  return array?.filter((item: any) => item.id === id)
} 