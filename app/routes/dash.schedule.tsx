import React, { useCallback, useState } from 'react'
import { useLoaderData } from '@remix-run/react'
import type { LinksFunction } from '@remix-run/react/dist/routeModules'
import { json, type ActionArgs, type LoaderArgs } from '@remix-run/server-runtime'

import type { Event } from 'react-big-calendar'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import styleSheet from "~/styles/SchedulerCss.css";

import Scheduler from '~/components/schedule/Scheduler'
import { events } from '~/components/Schedule/events/events'
import ListsAsDraggableItems from '~/components/schedule/ListsAsDraggableItems'
import { transformRoutineDataDates, transformToDoDataDates } from '~/components/utilities/helperFunctions'
import { getListAndTodos } from '~/models/list.server'
import { getRoutines } from '~/models/routines.server'
import { requireUserId } from '~/models/session.server'

import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndToDos } from '~/types/routineTypes'


//example from https://github.com/jquense/react-big-calendar/blob/master/stories/demos/exampleCode/dndOutsideSource.js

//! 1. save existing data into a word file
//! 2. make new schema 
//! 3. migrate schema
//! 4. save events to db
//! 5. load events from db
//! 6. convert laoded events to be displayed in calendar

//* consider how to structure and sync saved events vs converted events
//* set up db for saving events 
//!  i dont 'want to store the todos in the schedule, jsut the list id, nad then dynmaically load the todos!!!!    */
//* load events from db

//! need new type for loading from db
//! could infer from db types
interface myEvent extends Event {
  id: number;
  title?: string;
  start: Date;
  end: Date;
  isDraggable?: boolean;
  allDay?: boolean;
  description?: string;
  resource?: any;
}

//*make sure works first?
interface ConvertedToEvent {
  id: string; // unique
  listId: string, // from list/routine  
  title?: string | undefined;
  start: Date;
  end: Date;
  isDraggable: boolean;
  allDay?: boolean;
  description?: { [key:string]: string};
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styleSheet }];

export const loader = async ({ request }: LoaderArgs) => {
  try {
    const userId = await requireUserId(request);
    const loadedToDos = await getListAndTodos({ userId });
    const loadedRoutines = await getRoutines({ userId });
    //!!!!!   import   the saved scheduled events from db
    // const loadedEvents = await getEvents({ userId });
    return json({ loadedToDos, loadedRoutines });
  } catch (error) {
    throw error
  }
}

export const action = async ({ request }: ActionArgs) => {
  //!! save scheduled events to db
  return null
  //save events to db
}

// loaded scheduled -events from file, convert to loaded from db
const eventsForThisWeek = updateScheduledEventsDatesToCurrentWeek(events)


function Schedule() {

  //!load saved scheduled events from DB
  const [saveScheduledLists, setSaveScheduledLists] = useState<boolean>(true)   //  SaveButton
  const [draggedList, setDraggedList] = useState<ListAndToDos | RoutineAndToDos>()
  const [scheduledLists, setScheduledLists] = useState<ConvertedToEvent[]>(eventsForThisWeek)

  //?  the strucutre of these events should be left to be simple, ( title, and todos, only)
  //  loadedLists -> scheduled events -> saved events
  //?  when added to the calendar, they should be converted to the event structure, with start and end dates, is draggable, all day, id
  //? loaded scheduled events will be of the correct format, and will be loaded from db
  const initialListsData = useLoaderData<typeof loader>();
  const loadedToDos: ListAndToDos[] = transformToDoDataDates(initialListsData.loadedToDos);
  const loadedRoutines: RoutineAndToDos[] = transformRoutineDataDates(initialListsData.loadedRoutines);

 
  const handleDragStart = useCallback((draggedItem: ListAndToDos | RoutineAndToDos) => {
    // console.log('handleDragStart and draggedItem is ', draggedItem)
    setDraggedList(draggedItem)
  }, [])


  const handleSaveScheduledLists = () => {
    //save to db
    setSaveScheduledLists(false)
  }

  console.log('scheduyled events are ', scheduledLists)

  return (
    <>
    {/* {//! color code bgs based on list type! */}
      <ListsAsDraggableItems
        loadedToDos={loadedToDos}
        loadedRoutines={loadedRoutines}
        handleDragStart={handleDragStart}
      />

      <div className='mt-12'>
        <strong>
          Drag and Drop a "list" from above into the Calendar below. Move, Resize, or Duplicate as necessary
        </strong>
      </div>
      <div className='my-6'>
        {saveScheduledLists &&
          <button
            className='btn btn-primary'
            onClick={handleSaveScheduledLists}
          >
            Save Changes to Schedule
          </button>}
      </div>

      <Scheduler
        scheduledLists={scheduledLists}
        setScheduledLists={setScheduledLists}
        draggedList={draggedList}
        setDraggedList={setDraggedList}
        saveScheduledLists={saveScheduledLists}
        setSaveScheduledLists={setSaveScheduledLists}
      />


    </>
  )
}


export default Schedule



///*  into helper function doc... for loading schedueled Events from DB - remake for this week
//  will have to change typing becuse input will change from .json file to db imports
function updateScheduledEventsDatesToCurrentWeek(events: myEvent[]): ConvertedToEvent[] {
  const currentDate = new Date()
  const currentWeekDay = currentDate.getDay()

  //get monday of the current week
  const currentWeekMonday = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentWeekDay + 1
  )

  return events.map((event) => {

    if (!event.start || !event.end) {
      throw new Error('Event start and end times must be defined');
    }
    const start = new Date(event.start)
    const end = new Date(event.end)

    const day = start.getDay()
    const startHour = start.getHours()
    const startMinutes = start.getMinutes()
    const endHour = end.getHours()
    const endMinutes = end.getMinutes()

    //create the new start and end dates
    const newStart = new Date(currentWeekMonday)
    newStart.setDate(newStart.getDate() + day - 1)
    newStart.setHours(startHour, startMinutes, 0, 0)

    const newEnd = new Date(newStart)
    newEnd.setHours(endHour, endMinutes, 0, 0)

    //! this should not be needed for events loaded from db... prob have to convert dates.
    //if the event.id is a number, convert to string
    const id = typeof event.id === 'number' ? event.id.toString() : event.id

    return {
      ...event,
      description: undefined,
      id: id,
      listId: id,
      start: newStart,
      end: newEnd,
      isDraggable: true,
    }
  })
}