import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { useFetcher, useLoaderData } from '@remix-run/react'
import type { LinksFunction } from '@remix-run/react/dist/routeModules'
import { json, type ActionArgs, type LoaderArgs } from '@remix-run/server-runtime'
import { parse } from 'querystring'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import styleSheet from "~/styles/SchedulerCss.css";

import Scheduler from '~/components/schedule/Scheduler'
import ListsAsDraggableItems from '~/components/schedule/ListsAsDraggableItems'
import { transformRoutineDataDates, transformToDoDataDates, transformScheduledListsDataDates } from '~/components/utilities/helperFunctions'
import { getListAndTodos } from '~/models/list.server'
import { getRoutines } from '~/models/routines.server'
import { requireUserId } from '~/models/session.server'
import { getScheduledLists, saveScheduledLists } from '~/models/scheduler.server'

import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndToDos } from '~/types/routineTypes'
import type { ScheduledList } from '@prisma/client'


//example from https://github.com/jquense/react-big-calendar/blob/master/stories/demos/exampleCode/dndOutsideSource.js

//!  i dont 'want to store the todos in the schedule, jsut the list id, nad then dynmaically load the todos!!!!    */

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styleSheet }];

export const loader = async ({ request }: LoaderArgs) => {
  try {
    const userId = await requireUserId(request);
    const loadedToDos = await getListAndTodos({ userId });
    const loadedRoutines = await getRoutines({ userId });
    const scheduledLists = await getScheduledLists({ userId })
    return json({ loadedToDos, loadedRoutines, scheduledLists });
  } catch (error) {
    throw error
  }
}

//!  how to delete a scheduled list ?

//the id mis-matchihng is a problem
//  each list requires a new id, so i need to create one on a drag
// but i need to delete that ide and have the db create an id, which is used for storage and updating

export const action = async ({ request }: ActionArgs) => {
  console.log(' in action')
  const userId = await requireUserId(request);
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const ScheduledLists: Omit<ScheduledList, 'createdAt' | 'updatedAt' | 'userId'>[] = JSON.parse(parsedBody.scheduledListsString as string);
  try {
    await saveScheduledLists({ userId, ScheduledLists })
  } catch (error) { throw error }
  return null
}

function Schedule() {

  const fetcher = useFetcher();
  const [saveScheduledLists, setSaveScheduledLists] = useState<boolean>(true)   //  SaveButton
  const [draggedList, setDraggedList] = useState<ListAndToDos | RoutineAndToDos>()
  const [scheduledLists, setScheduledLists] = useState<ScheduledList[] | Omit<ScheduledList, 'createdAt' | 'updatedAt' | 'userId'>[]>([])

  //?  the strucutre of these events should be left to be simple, ( title, and todos, only)
  //?  when added to the calendar, they should be converted to the event structure, with start and end dates, is draggable, all day, id
  //? loaded scheduled events will be of the correct format, and will be loaded from db
  const initialListsData = useLoaderData<typeof loader>();
  const loadedToDos: ListAndToDos[] = transformToDoDataDates(initialListsData.loadedToDos);
  const loadedRoutines: RoutineAndToDos[] = transformRoutineDataDates(initialListsData.loadedRoutines);
  const loadedScheduledLists: ScheduledList[] = useMemo(() => transformScheduledListsDataDates(initialListsData.scheduledLists), [initialListsData.scheduledLists])

  useEffect(() => {
    console.log('in use Effect')
    //reset dates to always be the current week  only needed for loaded events... new/unsaved lists are always dnd into current week
    setScheduledLists(updateScheduledListsDatesToCurrentWeek(loadedScheduledLists))
  }, [loadedScheduledLists])

  const handleDragStart = useCallback((draggedItem: ListAndToDos | RoutineAndToDos) => {
    setDraggedList(draggedItem)
  }, [])


  const handleSaveScheduledLists = async () => {
    const scheduledListsString = JSON.stringify(scheduledLists)
    try {
      fetcher.submit({
        scheduledListsString
      }, {
        method: 'POST',
        action: '/dash/schedule',
      })
    } catch (error) { throw error }
    setSaveScheduledLists(false)
  }

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
          // type='submit'
          >
            Save Changes to Schedule
          </button>}
      </div>

      {/* uses a different type for scheduled events, and saved events */}
      <Scheduler
        scheduledLists={scheduledLists}
        setScheduledLists={setScheduledLists}
        draggedList={draggedList}
        setDraggedList={setDraggedList}
        // saveScheduledLists={saveScheduledLists}
        setSaveScheduledLists={setSaveScheduledLists}
      />


    </>
  )
}


export default Schedule



///*  into helper function doc... for loading schedueled Events from DB - remake for this week
//  will have to change typing becuse input will change from .json file to db imports
function updateScheduledListsDatesToCurrentWeek(lists: ScheduledList[]): ScheduledList[] {
  const currentDate = new Date()
  const currentWeekDay = currentDate.getDay()

  //get monday of the current week
  const currentWeekMonday = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentWeekDay + 1
  )

  return lists.map((list): ScheduledList => {

    if (!list.start || !list.end) {
      throw new Error('Event start and end times must be defined');
    }
    const start = new Date(list.start)
    const end = new Date(list.end)

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

    return {
      ...list,
      start: newStart,
      end: newEnd,
    }
  })
}