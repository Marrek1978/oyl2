import { parse } from 'querystring'
import type { ScheduledItem } from '@prisma/client'
import { useFetcher, useRouteLoaderData } from '@remix-run/react'
import { useState, useCallback, useMemo, useEffect } from 'react'
import type { LinksFunction } from '@remix-run/react/dist/routeModules'
import { json, type ActionArgs, type LoaderArgs } from '@remix-run/server-runtime'

import styleSheet from "~/styles/SchedulerCss.css";
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import DndInfo from '~/components/dnds/DndInfo'
import HeadingH2 from '~/components/titles/HeadingH2'
import Scheduler from '~/components/schedule/Scheduler'
import { requireUserId } from '~/models/session.server'
import BtnWithProps from '~/components/buttons/BtnWithProps'
import { ChangeListArrayDates } from './dash.listsandroutines'
import { getAllMiscAndSpecialLists } from '~/models/list.server'
import SubHeading16px from '~/components/titles/SubHeading16px'
import { getAllMiscAndSpecialRoutines } from '~/models/routines.server'
import { getDesiresWithOutcomesListsRoutines } from '~/models/desires.server'
import { ArrayOfObjectsStrToDates } from '~/components/utilities/helperFunctions'
import DraggableListsOrRoutines from '~/components/schedule/DraggableListsOrRoutines'
import { deleteScheduledItem, getScheduledItems, createScheduledItems } from '~/models/scheduler.server'
import DesiresAndOutcomesWithListsAndRoutinesAsDraggables from '~/components/schedule/OutcomesDesiresListsRoutinesDraggables'

import type { Item } from '~/types/itemTypes'
import type { ListAndToDos } from '~/types/listTypes'
import type { OutcomeWithAll } from '~/types/outcomeTypes'
import type { RoutineAndTasks } from '~/types/routineTypes'


//example from https://github.com/jquense/react-big-calendar/blob/master/stories/demos/exampleCode/dndOutsideSource.js
//?  set save changes to scheudle button to only show when changes are made to schedule, not on a drag
//!  i dont 'want to store the todos in the schedule, jsut the list id, nad then dynmaically load the todos!!!!    */
//!  stop propgation to day view, so that it doesnt open the day view when clicking a day
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styleSheet }];

export type DraggedItem = ListAndToDos | RoutineAndTasks | OutcomeWithAll | undefined


export const loader = async ({ request }: LoaderArgs) => {
  try {
    const userId = await requireUserId(request);
    const loadedScheduledItems = await getScheduledItems(userId)
    const loadedDesiresWithOutcomesListsRoutines = await getDesiresWithOutcomesListsRoutines(userId);
    const loadedMiscAndSpecialLists = await getAllMiscAndSpecialLists(userId);
    const loadedMiscAndSpecialRoutines = await getAllMiscAndSpecialRoutines(userId);

    return {
      loadedDesiresWithOutcomesListsRoutines,
      loadedMiscAndSpecialLists,
      loadedScheduledItems,
      loadedMiscAndSpecialRoutines
    }
  } catch (error) {
    throw error
  }
}


export const action = async ({ request }: ActionArgs) => {
  if (request.method === 'POST') {
    const userId = await requireUserId(request);
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const scheduledItems: Item[] = JSON.parse(parsedBody.scheduledItemsString as string);
    try {
      await createScheduledItems({ userId, scheduledItems })
    } catch (error) { throw error }
  }

  if (request.method === 'DELETE') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const idToDelete = parsedBody.idToDelete as string
    try {
      await deleteScheduledItem({ id: idToDelete })
      return json({ status: 'success' }, { status: 200 })
    } catch (error) { throw error }
  }
  return null
}


function Schedule() {

  const fetcher = useFetcher();
  const [currentTab, setCurrentTab] = useState<string>('outcomes')
  const [isSaveSchedule, setIsSaveSchedule] = useState<boolean>(false)   //  SaveButton
  const [draggedItem, setDraggedItem] = useState<ListAndToDos | RoutineAndTasks | OutcomeWithAll | undefined>()
  const [scheduledItems, setScheduledItems] = useState<Item[]>([])
  //?  when added to the calendar, they should be converted to the event structure, with start and end dates, is draggable, all day, id
  //? loaded scheduled events will be of the correct format, and will be loaded from db

  //! completed = strikethrough
  //!  load and place appointments
  //!  load and place due dates
  //! make all memoized functions, and move to helper functions doc?  


  const loadedScheduledItems: ScheduledItem[] = useGetLoadedScheduledItems()
  const thisWeeksScheduledItems = useMemo(() => updateScheduledListsDatesToCurrentWeek(loadedScheduledItems), [loadedScheduledItems])

  const { miscLists, specialLists } = useGetLoadedMiscAndSpecialLists()
  const { miscRoutines, specialRoutines } = useGetLoadedMiscAndSpecialRoutines()
  const loadedOutcomes: any = useGetLoadedOutcomes()

  useEffect(() => {
    setScheduledItems(thisWeeksScheduledItems)
  }, [thisWeeksScheduledItems])


  const handleDragStart = useCallback((item: DraggedItem) => {
    setDraggedItem(item)
  }, [])


  useEffect(() => {
    setIsSaveSchedule(!areArraysEqual(scheduledItems, thisWeeksScheduledItems))
  }, [scheduledItems, thisWeeksScheduledItems])


  const handleSaveSchedule = async () => {
    const scheduledItemsString = JSON.stringify(scheduledItems)
    try {
      fetcher.submit({
        scheduledItemsString
      }, {
        method: 'POST',
      })
    } catch (error) { throw error }
    setIsSaveSchedule(false)
  }


  const handleTabsClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setCurrentTab(event.currentTarget.id)
  }


  return (
    <>
      <SubHeading16px text='Schedule' />

      <div className='mt-6'>
        <HeadingH2 text='Draggable Lists and Routines' />
      </div>

      <div className='my-4'>
        <div className="tabs">
          <div className={`tab tab-lg tab-lifted ${currentTab === 'outcomes' ? 'tab-active' : ''}`} id='outcomes'
            onClick={handleTabsClick}
          > Outcomes</div>
          <div className={`tab tab-lg tab-lifted ${currentTab === 'special' ? 'tab-active' : ''}`} id='special'
            onClick={handleTabsClick}
          >Special</div>
          <div className={`tab tab-lg tab-lifted ${currentTab === 'misc' ? 'tab-active' : ''}`} id='misc'
            onClick={handleTabsClick}
          >Miscellaneous</div>
        </div>
      </div>


      <section className='flex flex-wrap gap-12'>
        {currentTab === 'outcomes' && (
          <>
            <div>
              <HeadingH2 text='Lists and Routines by Desire and  Outcome' />
              <DndInfo />
              <div className='mt-4'>
                <DesiresAndOutcomesWithListsAndRoutinesAsDraggables
                  OutcomesWithAll={loadedOutcomes}
                  handleDragStart={handleDragStart}
                />
              </div>
            </div>
          </>
        )}


        {currentTab === 'special' && (
          <>
            <div>
              <HeadingH2 text='Special Lists and Routines' />
              <DndInfo />
              <div className='mt-4'>
                <DraggableListsOrRoutines
                  handleDragStart={handleDragStart}
                  listsArray={specialLists}
                  routinesArray={specialRoutines}
                />
              </div>
            </div>
          </>
        )}

        {currentTab === 'misc' && (
          <>
            <div>
              <HeadingH2 text='Miscellaneous Lists and Routines' />
              <DndInfo />
              <div className='mt-4'>
                <DraggableListsOrRoutines
                  handleDragStart={handleDragStart}
                  listsArray={miscLists}
                  routinesArray={miscRoutines}
                />
              </div>
            </div>
          </>
        )}


        <div className='flex-1'>
          <div className='mt-0'>
            <strong>
              Drag and Drop a "list" from above into the Calendar below. Move, Resize, or Duplicate as necessary
            </strong>
          </div>

          <div className='my-6'>
            <BtnWithProps
              btnPurpose='save'
              btnType='button'
              onClickFunction={handleSaveSchedule}
              btnLabel='Save Changes to Schedule'
              isBtnDisabled={!isSaveSchedule}
            />
          </div>


          <Scheduler
            scheduledItems={scheduledItems}
            setScheduledItems={setScheduledItems}
            draggedItem={draggedItem}
            setDraggedItem={setDraggedItem}
            isSaveScheduledItems={isSaveSchedule}
            setIsSaveScheduledItems={setIsSaveSchedule}
          // loadedMiscAndSpecialToDos={loadedToDos}
          // loadedMiscAndSpecialRoutines={loadedRoutines}
          // outcomesWithLists={outcomesWithLists}
          />

        </div>

      </section>
    </>
  )
}


export default Schedule



///*  into helper function doc... for loading schedueled Events from DB - remake for this week
//  will have to change typing becuse input will change from .json file to db imports
export function updateScheduledListsDatesToCurrentWeek(items: ScheduledItem[]): ScheduledItem[] {
  const currentDate = new Date()
  const currentWeekDay = currentDate.getDay()

  //get monday of the current week
  const currentWeekMonday = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentWeekDay + 1
  )

  return items.map((item): ScheduledItem => {

    if (!item.start || !item.end) {
      throw new Error('Event start and end times must be defined');
    }
    const start = new Date(item.start)
    const end = new Date(item.end)

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
      ...item,
      start: newStart,
      end: newEnd,
    }
  })
}


function areArraysEqual(arr1: Item[], arr2: Item[]) {
  if (arr1.length !== arr2.length) return false
  const sortedArr1: Item[] = arr1.sort((a, b) => a.id.localeCompare(b.id))
  const sortedArr2: Item[] = arr2.sort((a, b) => a.id.localeCompare(b.id))
  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) return false
  }
  return true
}



// {
//   loadedDesiresWithOutcomesListsRoutines,
//   loadedMiscAndSpecialLists,
//   loadedScheduledItems,
//   loadedMiscAndSpecialRoutines
// }


export const useGetScheduleLoaders = () => {
  const path = 'routes/dash.schedule'
  const loaderData = useRouteLoaderData(path);
  return loaderData;
};


export const useGetLoadedScheduledItems = () => {
  const [items, setitems] = useState<ScheduledItem[]>([])
  const { loadedScheduledItems } = useGetScheduleLoaders();

  useEffect(() => {
    if (!loadedScheduledItems) return
    const itemsWithProperDates = ArrayOfObjectsStrToDates({ items: loadedScheduledItems, dateKeys: ['createdAt', 'updatedAt'] })
    setitems(itemsWithProperDates)
  }, [loadedScheduledItems])

  return items
}


export const useGetLoadedLists = (): ListAndToDos[] => {
  const [miscAndSpecialLists, setMiscAndSpecialLists] = useState<ListAndToDos[]>([])
  const { loadedMiscAndSpecialLists } = useGetScheduleLoaders();

  useEffect(() => {
    if (!loadedMiscAndSpecialLists) return
    const miscAndSpecialListsWithProperDates: ListAndToDos[] = ChangeListArrayDates(loadedMiscAndSpecialLists)
    setMiscAndSpecialLists(miscAndSpecialListsWithProperDates)
  }, [loadedMiscAndSpecialLists])

  return miscAndSpecialLists
}

type ReturnMiscAndSpecialListsType = {
  miscLists: ListAndToDos[]
  specialLists: ListAndToDos[]
}

export const useGetLoadedMiscAndSpecialLists = (): ReturnMiscAndSpecialListsType => {
  const [miscLists, setMiscLists] = useState<ListAndToDos[]>([])
  const [specialLists, setSpecialLists] = useState<ListAndToDos[]>([])
  const miscAndSpecialLists = useGetLoadedLists();

  useEffect(() => {
    if (!miscAndSpecialLists) return
    const miscListsWithProperDates: ListAndToDos[] = miscAndSpecialLists.filter((list: ListAndToDos) => (list.isSpecialList === false))
    setMiscLists(miscListsWithProperDates)
    const specialListsWithProperDates: ListAndToDos[] = miscAndSpecialLists.filter((list: ListAndToDos) => (list.isSpecialList === true))
    setSpecialLists(specialListsWithProperDates)
  }, [miscAndSpecialLists])

  return { miscLists, specialLists }
}


export const useGetLoadedRoutines = (): RoutineAndTasks[] => {
  const [miscAndSpecialRoutines, setmiscAndSpecialRoutines] = useState<RoutineAndTasks[]>([])
  const { loadedMiscAndSpecialRoutines } = useGetScheduleLoaders();

  useEffect(() => {
    if (!loadedMiscAndSpecialRoutines) return
    const miscAndSpecialRoutinesWithProperDates: RoutineAndTasks[] = ChangeListArrayDates(loadedMiscAndSpecialRoutines)
    setmiscAndSpecialRoutines(miscAndSpecialRoutinesWithProperDates)
  }, [loadedMiscAndSpecialRoutines])

  return miscAndSpecialRoutines
}


export const useGetLoadedMiscAndSpecialRoutines = () => {
  const [miscRoutines, setMiscRoutines] = useState<RoutineAndTasks[]>([])
  const [specialRoutines, setSpecialRoutines] = useState<RoutineAndTasks[]>([])
  const miscAndSpecialRoutines: RoutineAndTasks[] = useGetLoadedRoutines();

  useEffect(() => {
    if (!miscAndSpecialRoutines) return
    const miscRoutinesWithProperDates: RoutineAndTasks[] = miscAndSpecialRoutines.filter((routine: RoutineAndTasks) => (routine.isSpecialRoutine === false))
    setMiscRoutines(miscRoutinesWithProperDates)

    const specialRoutinesWithProperDates: RoutineAndTasks[] = miscAndSpecialRoutines.filter((routine: RoutineAndTasks) => (routine.isSpecialRoutine === true))
    setSpecialRoutines(specialRoutinesWithProperDates)
  }, [miscAndSpecialRoutines])

  return { miscRoutines, specialRoutines }
}


export const useGetLoadedOutcomes = () => {
  const { loadedDesiresWithOutcomesListsRoutines } = useGetScheduleLoaders();
  return loadedDesiresWithOutcomesListsRoutines
}


