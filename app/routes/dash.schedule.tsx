import { parse } from 'querystring'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { useState, useCallback, useMemo, useEffect } from 'react'
import type { LinksFunction } from '@remix-run/react/dist/routeModules'
import { json, type ActionArgs, type LoaderArgs } from '@remix-run/server-runtime'

import styleSheet from "~/styles/SchedulerCss.css";
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import HeadingH2 from '~/components/titles/HeadingH2'
import { requireUserId } from '~/models/session.server'
// import Scheduler from '~/components/schedule/Scheduler'
import { getMiscListsAndTodos, getSpecialListsWithTodos } from '~/models/list.server'
import SubHeading16px from '~/components/titles/SubHeading16px'
// import MiscellaneousLists from '~/components/schedule/MiscellaneousLists'
// import ProjectsListAndDraggables from '~/components/schedule/ProjectsListAndDraggables'
import { deleteScheduledItem, getScheduledItems, saveScheduledItems } from '~/models/scheduler.server'
// import { transformRoutineDataDates, transformToDoDataDates, transformScheduledListsDataDates, } from '~/components/utilities/helperFunctions'
// import ListsAsDraggableItems from '~/components/schedule/ListsAsDraggableItems'
// import SpecialLists from '~/components/schedule/SpecialLists'

import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndTasks } from '~/types/routineTypes'
import type { ScheduledItem } from '@prisma/client'
import { getDesiresWithOutcomesListsRoutines } from '~/models/desires.server'
import { getMiscRoutinesWithTasks, getSpecialRoutinesWithTasks } from '~/models/routines.server'
import Scheduler from '~/components/schedule/Scheduler'
import DesiresAndOutcomesWithListsAndRoutinesAsDraggables from '~/components/schedule/OutcomesDesiresListsRoutinesDraggables'
import MiscellaneousLists from '~/components/schedule/MiscellaneousLists'
import BtnWithProps from '~/components/buttons/BtnWithProps'
import type { OutcomeWithAll } from '~/types/outcomeTypes'


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
    const loadedDesiresWithOutcomesListsRoutines = await getDesiresWithOutcomesListsRoutines(userId);
    const loadedMiscLists = await getMiscListsAndTodos(userId);
    const loadedMiscRoutines = await getMiscRoutinesWithTasks(userId);
    const loadedSpecialLists = await getSpecialListsWithTodos(userId);
    const loadedSpecialRoutines = await getSpecialRoutinesWithTasks(userId);
    // const loadedToDos = await getListAndTodos(userId); //! get all and filter on client
    // const loadedToDos = await getAllListsAndTodos(userId); //! get all and filter on client
    // const loadedRoutines = await getAllRoutines(userId);//! get all and filter on client
    // const loadedOutcomes = await (userId);
    const loadedScheduledLists = await getScheduledItems(userId)
    // return json({ loadedToDos, loadedRoutines, scheduledLists, loadedProjects });
    return {
      loadedDesiresWithOutcomesListsRoutines,
      loadedMiscLists,
      loadedMiscRoutines,
      loadedSpecialLists,
      loadedSpecialRoutines,
      loadedScheduledLists
    }
  } catch (error) {
    throw error
  }
}

//!  how to delete a scheduled list ?

//the id mis-matchihng is a problem
//  each list requires a new id, so i need to create one on a drag
// but i need to delete that ide and have the db create an id, which is used for storage and updating

export const action = async ({ request }: ActionArgs) => {
  if (request.method === 'POST') {
    const userId = await requireUserId(request);
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const scheduledItems: ScheduledItem[] | Omit<ScheduledItem, 'createdAt' | 'updatedAt' | 'userId'>[] = JSON.parse(parsedBody.scheduledListsString as string);
    try {
      await saveScheduledItems({ userId, scheduledItems })
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
  const [isSaveScheduledLists, setIsSaveScheduledLists] = useState<boolean>(false)   //  SaveButton
  const [draggedItem, setDraggedItem] = useState<ListAndToDos | RoutineAndTasks | OutcomeWithAll | undefined>()
  const [scheduledItems, setScheduledItems] = useState<ScheduledItem[] | Omit<ScheduledItem, 'createdAt' | 'updatedAt' | 'userId'>[]>([])
  //?  when added to the calendar, they should be converted to the event structure, with start and end dates, is draggable, all day, id
  //? loaded scheduled events will be of the correct format, and will be loaded from db


  const { loadedDesiresWithOutcomesListsRoutines,
    loadedMiscLists,
    loadedMiscRoutines,
    // loadedSpecialLists,
    // loadedSpecialRoutines,
    loadedScheduledLists
  } = useLoaderData()
  // console.log("🚀 ~ file: dash.schedule.tsx:109 ~ Schedule ~ loadedDesiresWithOutcomesListsRoutines:", loadedDesiresWithOutcomesListsRoutines)
  // console.log("🚀 ~ file: dash.schedule.tsx:99 ~ Schedule ~ specialRoutines:", specialRoutines)
  // console.log("🚀 ~ file: dash.schedule.tsx:99 ~ Schedule ~ specialLists:", specialLists)
  // console.log("🚀 ~ file: dash.schedule.tsx:99 ~ Schedule ~ desiresWithOutcomesListsRoutines:", desiresWithOutcomesListsRoutines)
  // console.log("🚀 ~ file: dash.schedule.tsx:99 ~ Schedule ~ miscRoutines:", miscRoutines)
  // console.log("🚀 ~ file: dash.schedule.tsx:99 ~ Schedule ~ miscLists:", miscLists)
  //! completed = strikethrough

  //!  load and place appointments
  //!  load and place due dates

  //! make all memoized functions, and move to helper functions doc?  
  //! need to separate the lists and todos, and the routines, and then convert the dates
  //! need to assemble project data, and convert dates, associated routines and lists, -- needs new types

  //! schedule save must be changed from on drop to a deep difference check, and then save on button click

  // const initialListsData = useLoaderData<typeof loader>();
  // const loadedScheduledLists: ScheduledList[] = useMemo(() => transformScheduledListsDataDates(initialListsData.scheduledLists), [initialListsData.scheduledLists])
  const thisWeeksScheduledItems = useMemo(() => updateScheduledListsDatesToCurrentWeek(loadedScheduledLists), [loadedScheduledLists])
  // const loadedToDos: ListAndToDos[] = useMemo(() => transformToDoDataDates(initialListsData.loadedToDos), [initialListsData.loadedToDos]) //initialListsData.loadedToDos as ListAndToDos[
  // // const loadedProjects: Project[] = useMemo(() => transformProjectDataDates(initialListsData.loadedProjects), [initialListsData.loadedProjects]) //initialListsData.loadedProjects as Project[]
  // const loadedRoutines: RoutineAndTasks[] = useMemo(() => transformRoutineDataDates(initialListsData.loadedRoutines), [initialListsData.loadedRoutines]) //initialListsData.loadedRoutines as RoutineAndToDos[]

  const miscLists = loadedMiscLists.filter((list: ListAndToDos) => (list.outcomeId === null))
  const miscRoutines = loadedMiscRoutines.filter((routine: RoutineAndTasks) => (routine.outcomeId === null))
  // const projectsWithListsAndRoutines: ProjectWithListsAndRoutines[] = loadedProjects.map(project => {
  //   const projectLists = loadedToDos.filter(list => list.projectId === project.id)
  //   const projectRoutines = loadedRoutines.filter(routine => routine.projectId === project.id)
  //   return {
  //     ...project,
  //     lists: projectLists,
  //     routines: projectRoutines
  //   }
  // })


  // useEffect(() => {
  //   setScheduledLists(thisWeeksScheduledLists)
  // }, [thisWeeksScheduledLists])


  const handleDragStart = useCallback((item: DraggedItem) => {
    setDraggedItem(item)
  }, [])


  useEffect(() => {
    if (scheduledItems !== thisWeeksScheduledItems) {
      console.log('scheduledLists !== loadedScheduledLists')
      setIsSaveScheduledLists(true)
    } else {
      setIsSaveScheduledLists(false)
    }
  }, [scheduledItems, thisWeeksScheduledItems])


  const handleSaveScheduledLists = async () => {
    const scheduledItemsString = JSON.stringify(scheduledItems)
    try {
      fetcher.submit({
        scheduledItemsString
      }, {
        method: 'POST',
        // action: '/dash/schedule',
      })
    } catch (error) { throw error }
    setIsSaveScheduledLists(false)
  }


  const handleTabsClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // console.log('handled tabs click', event.currentTarget.id)
    setCurrentTab(event.currentTarget.id)
  }


  return (
    <>

      <SubHeading16px text='Schedule' />

      <div className='my-4'>
        <div className="tabs">
          <div className={`tab tab-lg tab-lifted ${currentTab === 'outcomes' ? 'tab-active' : ''}`} id='outcomes'
            onClick={handleTabsClick}
          >Desires & Outcomes</div>
          <div className={`tab tab-lg tab-lifted ${currentTab === 'special' ? 'tab-active' : ''}`} id='special'
            onClick={handleTabsClick}
          >Special Lists</div>
          <div className={`tab tab-lg tab-lifted ${currentTab === 'misc' ? 'tab-active' : ''}`} id='misc'
            onClick={handleTabsClick}
          >Misc. Lists and Routines</div>
        </div>
      </div>


      <section className='flex flex-wrap gap-12'>
        {currentTab === 'outcomes' && (
          <>
            <div>
              <HeadingH2 text='Desires & Outcomes' />

              <div className='mt-4'>
                <DesiresAndOutcomesWithListsAndRoutinesAsDraggables
                  OutcomesWithAll={loadedDesiresWithOutcomesListsRoutines}
                  handleDragStart={handleDragStart}
                />
                {/* <ProjectsListAndDraggables
                  projectsWithListsAndRoutines={projectsWithListsAndRoutines}
                  handleDragStart={handleDragStart}
                /> */}
              </div>
            </div>
          </>
        )}


        {currentTab === 'special' && (
          <>
            <div>
              <HeadingH2 text='Special Lists' />
              <div className='mt-4'>
                {/* <SpecialLists
                  projectsWithListsAndRoutines={projectsWithListsAndRoutines}
                  handleDragStart={handleDragStart}
                /> */}
              </div>
            </div>
          </>
        )}

        {currentTab === 'misc' && (
          <>
            <div>
              <HeadingH2 text='Miscellaneous Lists' />
              <div className='mt-4'>
                <MiscellaneousLists
                  handleDragStart={handleDragStart}
                  miscLists={miscLists}
                  miscRoutines={miscRoutines}
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
              onClickFunction={handleSaveScheduledLists}
              btnLabel='Save Changes to Schedule'
              isBtnDisabled={!isSaveScheduledLists}
            />
          </div>


          aasdfasdf

          <Scheduler
            scheduledItems={scheduledItems}
            setScheduledItems={setScheduledItems}
            draggedItem={draggedItem}
            setDraggedItem={setDraggedItem}
            isSaveScheduledItems={isSaveScheduledLists}
            setIsSaveScheduledItems={setIsSaveScheduledLists}
          // loadedToDos={loadedToDos}
          // loadedRoutines={loadedRoutines}
          />

        </div>

      </section>
    </>
  )
}


export default Schedule



///*  into helper function doc... for loading schedueled Events from DB - remake for this week
//  will have to change typing becuse input will change from .json file to db imports
function updateScheduledListsDatesToCurrentWeek(lists: ScheduledItem[]): ScheduledItem[] {
  const currentDate = new Date()
  const currentWeekDay = currentDate.getDay()

  //get monday of the current week
  const currentWeekMonday = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentWeekDay + 1
  )

  return lists.map((list): ScheduledItem => {

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