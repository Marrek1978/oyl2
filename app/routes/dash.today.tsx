// import { parse } from 'querystring'
import { format } from 'date-fns'
import { useLoaderData } from '@remix-run/react'
import { useEffect, useState, useMemo } from 'react'
import type { LinksFunction } from '@remix-run/react/dist/routeModules'
import { json, type ActionArgs, type LoaderArgs } from '@remix-run/server-runtime'

import styleSheet from "~/styles/SchedulerCss.css";
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import { getProjects } from '~/models/project.server'
import HeadingH2 from '~/components/titles/HeadingH2'
import { requireUserId } from '~/models/session.server'
// import Scheduler from '~/components/schedule/Scheduler'
import { getAllRoutines } from '~/models/routines.server'
import { getAllListAndTodos } from '~/models/list.server'
import { getScheduledLists } from '~/models/scheduler.server'
import { transformRoutineDataDates, transformToDoDataDates, transformScheduledListsDataDates, transformProjectDataDates, transformDesireWithOutcomesDataDates } from '~/components/utilities/helperFunctions'
// import ListsAsDraggableItems from '~/components/schedule/ListsAsDraggableItems'
// import SpecialLists from '~/components/schedule/SpecialLists'

import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndToDos } from '~/types/routineTypes'
import type { Project, ScheduledList } from '@prisma/client'
import type { ProjectWithListsAndRoutines } from '~/types/projectTypes'
import Today from '~/components/today/Today'
import { getDesiresAndOutcomes } from '~/models/desires.server'
import { DesireWithOutcomes } from '~/types/desireTypes'
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG'
import SubHeading14px from '~/components/titles/SubHeading14px'
import HeadingH1 from '~/components/titles/HeadingH1'
import HeadingH3 from '~/components/titles/HeadingH3'
import HeadingH5 from '~/components/titles/HeadingH5'
import DisplayCurrentEvent from '~/components/today/DisplayCurrentEvent'
import DisplayImportantLists from '~/components/today/DisplayImportantLists'


//example from https://github.com/jquense/react-big-calendar/blob/master/stories/demos/exampleCode/dndOutsideSource.js
//?  set save changes to scheudle button to only show when changes are made to schedule, not on a drag
//!  i dont 'want to store the todos in the schedule, jsut the list id, nad then dynmaically load the todos!!!!    */
//!  stop propgation to day view, so that it doesnt open the day view when clicking a day
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styleSheet }];

export const loader = async ({ request }: LoaderArgs) => {
  try {
    const userId = await requireUserId(request);
    // const loadedToDos = await getListAndTodos(userId); //! get all and filter on client
    const loadedToDos = await getAllListAndTodos(userId); //! get all and filter on client
    const loadedRoutines = await getAllRoutines(userId);//! get all and filter on client
    const loadedProjects = await getProjects(userId);
    const scheduledLists = await getScheduledLists(userId)
    const loadedDesires: DesireWithOutcomes[] = await getDesiresAndOutcomes(userId)
    return json({ loadedToDos, loadedRoutines, scheduledLists, loadedProjects, loadedDesires });
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
    // const userId = await requireUserId(request);
    // const formBody = await request.text();
    // const parsedBody = parse(formBody);
    // const ScheduledLists: ScheduledList[] | Omit<ScheduledList, 'createdAt' | 'updatedAt' | 'userId'>[] = JSON.parse(parsedBody.scheduledListsString as string);
    // try {
    //   await saveScheduledLists({ userId, ScheduledLists })
    // } catch (error) { throw error }
  }

  if (request.method === 'DELETE') {
    // const formBody = await request.text();
    // const parsedBody = parse(formBody);
    // const idToDelete = parsedBody.idToDelete as string
    // try {
    //   await deleteScheduledList({ id: idToDelete })
    //   return json({ status: 'success' }, { status: 200 })
    // } catch (error) { throw error }
  }
  return null
}

function Schedule() {

  // const fetcher = useFetcher();
  const [saveScheduledLists, setSaveScheduledLists] = useState<boolean>(false)   //  SaveButton
  // const [draggedList, setDraggedList] = useState<ListAndToDos | RoutineAndToDos | ProjectWithListsAndRoutines>()
  const [scheduledLists, setScheduledLists] = useState<ScheduledList[]>([])
  const [todaysEvents, setTodaysEvents] = useState<ScheduledList[]>([])
  const [currentEvent, setCurrentEvent] = useState<ScheduledList | null>(null)

  const currentDate = format(new Date(), 'EEE, MMMM d');
  const currentTime = format(new Date(), 'HH:mm')


  //?  when added to the calendar, they should be converted to the event structure, with start and end dates, is draggable, all day, id
  //? loaded scheduled events will be of the correct format, and will be loaded from db

  //! completed = strikethrough

  //!  load and place appointments
  //!  load and place due dates

  //! make all memoized functions, and move to helper functions doc?  
  //! need to separate the lists and todos, and the routines, and then convert the dates
  //! need to assemble project data, and convert dates, associated routines and lists, -- needs new types

  const initialListsData = useLoaderData<typeof loader>();
  const loadedScheduledLists: ScheduledList[] = useMemo(() => transformScheduledListsDataDates(initialListsData.scheduledLists), [initialListsData.scheduledLists])
  const thisWeeksScheduledLists = useMemo(() => updateScheduledListsDatesToCurrentWeek(loadedScheduledLists), [loadedScheduledLists])
  const loadedToDos: ListAndToDos[] = useMemo(() => transformToDoDataDates(initialListsData.loadedToDos), [initialListsData.loadedToDos]) //initialListsData.loadedToDos as ListAndToDos[
  const loadedProjects: Project[] = useMemo(() => transformProjectDataDates(initialListsData.loadedProjects), [initialListsData.loadedProjects]) //initialListsData.loadedProjects as Project[]
  const loadedRoutines: RoutineAndToDos[] = useMemo(() => transformRoutineDataDates(initialListsData.loadedRoutines), [initialListsData.loadedRoutines]) //initialListsData.loadedRoutines as RoutineAndToDos[]
  const loadedDesires: DesireWithOutcomes[] = useMemo(() => transformDesireWithOutcomesDataDates(initialListsData.loadedDesires), [initialListsData.loadedDesires]) //initialListsData.loadedRoutines as RoutineAndToDos[]
  // const loadedDesires: Desire[] = useMemo(() => transformRoutineDataDates(initialListsData.loadedDesires), [initialListsData.loadedDesires]) //initialListsData.loadedRoutines as RoutineAndToDos[]
  // console.log('loadedDesires.desireOutcomes is ', loadedDesires.desireOutcomes)

  // const miscellaneousLists = loadedToDos.filter(list => (list.projectId === null && list.outcomeId === null))
  // const miscellaneousRoutines = loadedRoutines.filter(routine => (routine.projectId === null && routine.outcomeId === null))
  const projectsWithListsAndRoutines: ProjectWithListsAndRoutines[] = loadedProjects.map(project => {
    const projectLists = loadedToDos.filter(list => list.projectId === project.id)
    const projectRoutines = loadedRoutines.filter(routine => routine.projectId === project.id)
    return {
      ...project,
      lists: projectLists,
      routines: projectRoutines
    }
  })




  const projectZero = projectsWithListsAndRoutines[0]
  // console.log('projectZero is ', projectZero)
  const projectZeroDesireId = projectZero?.desireId
  // console.log('projectZeroDesireId is ', projectZeroDesireId)
  const projectZeroDesire = loadedDesires?.find((desire) => (desire.id === projectZeroDesireId))
  // console.log('projectZeroDesire is ', projectZeroDesire)
  const projectZeroDesireOutcomeZero = projectZeroDesire?.desireOutcomes[0]
  // console.log('projectZeroDesireOutcomeZero is ', projectZeroDesireOutcomeZero)


  useEffect(() => {
    const todaysEventList = getTodaysEvents(thisWeeksScheduledLists)
    setTodaysEvents(todaysEventList)
  }, [thisWeeksScheduledLists])

  useEffect(() => {
    const invervalId = setInterval(() => {
      setCurrentEvent(getCurrentEvent(todaysEvents))
    }, (1000 * 60));
    return () => clearInterval(invervalId)
  })

  useEffect(() => {
    setCurrentEvent(getCurrentEvent(todaysEvents))
    // console.log('todaysEvents is ', todaysEvents)
    // console.log('currentEvent is ', getCurrentEvent(todaysEvents))
  }, [todaysEvents])


  useEffect(() => {
    setScheduledLists(thisWeeksScheduledLists)
  }, [thisWeeksScheduledLists])


  useEffect(() => {
    if (scheduledLists !== thisWeeksScheduledLists) {
      setSaveScheduledLists(true)
    } else {
      setSaveScheduledLists(false)
    }
  }, [scheduledLists, thisWeeksScheduledLists])


  return (
    <>
      <article>

        <BasicTextAreaBG pageTitle={'Main Focus Today'} >
          <div className='flex flex-wrap flex-col gap-8 w-full  '>

            <div>
              <div className='text-base-content'>
                <HeadingH1 text={projectZeroDesireOutcomeZero?.title || ''} />
              </div>

              <div className="flex gap-4 text-base-content/70">
                <div  >
                  <SubHeading14px text={'Project #1 : '} />
                </div>
                <div className='text-secondary/70'>
                  <SubHeading14px text={projectZero.title} />
                </div>
              </div>

              <div className="flex gap-4 text-base-content/70">
                <div  >
                  <SubHeading14px text={'For Desire : '} />
                </div>
                <div className='text-secondary/70'>
                  <SubHeading14px text={projectZeroDesire?.title || ''} />
                </div>
              </div>
            </div>


            <div className='flex flex-col gap-y-8 '>

              <div className='flex flex-wrap gap-8 '>
                <div  >
                  <div className='text-base-content/70' >
                    <SubHeading14px text='Steps to Success' />
                  </div>
                  <ul className="steps mt-4 ">
                    <li className="step step-primary">Register</li>
                    <li className="step step-primary">Choose plan</li>
                    <li className="step">Purchase</li>
                    <li className="step">Receive Product</li>
                  </ul>

                  <div className='flex flex-wrap gap-8 mt-8 '>
                    <div>
                      <HeadingH3 text="Routines" />
                      <HeadingH5 text='Routine 1' />
                      <HeadingH5 text='Routine 2' />
                      <HeadingH5 text='Routine 3' />
                    </div>
                    <div>
                      <HeadingH3 text="Lists" />
                      <HeadingH5 text='List 1' />
                      <HeadingH5 text='List 2' />
                      <HeadingH5 text='List 3' />
                    </div>

                    <div>
                      <HeadingH3 text="Habits" />
                      <HeadingH5 text='Habit 1' />
                      <HeadingH5 text='Habit 2' />
                      <HeadingH5 text='Habit 3' />
                    </div>
                    <div>
                      <HeadingH3 text="$ Tracker" />
                      <HeadingH5 text='Tracker 1' />
                      <HeadingH5 text='Tracker 2' />
                      <HeadingH5 text='Tracker 3' />
                    </div>
                  </div>
                </div>


                <div className=' flex flex-wrap gap-8 flex-1   '>
                  <div className='w-prose max-w-prose'>
                    <HeadingH2 text="Outcome's Vision" />
                  </div>
                  <div className='w-prose max-w-prose'>
                    <HeadingH2 text="Desire's Vision" />
                  </div>
                  <div className='w-prose max-w-prose'>
                    <HeadingH2 text="Life's Vision" />
                  </div>
                </div>
              </div>
            </div>


            <div className='w-full'>
              <DisplayImportantLists
                loadedToDos={loadedToDos}
              />
            </div>


            <div className='flex flex-wrap gap-8 mt-8'>
              <div className='w-[400px]  ' >
                <HeadingH2 text={`Today: ${currentDate}`} />
                <Today
                  scheduledLists={scheduledLists}
                  loadedToDos={loadedToDos}
                  loadedRoutines={loadedRoutines}
                />
              </div>

              <div className='w-[400px] h-[400px] border-2 border-red-600'>
              <HeadingH2 text={`Currently working on`} />
               <div>
                  today: {currentDate} <br />
                  now: {currentTime}
                </div>
                <div>
                  {currentEvent?.title}
                  {currentEvent && (
                    <DisplayCurrentEvent event={currentEvent} />
                  )}
                </div>
              </div>
              <div>
              <HeadingH2 text={`appointments`} />
              </div>
            </div>
          </div>

        </BasicTextAreaBG>
      </article>
    </>
  )
}


export default Schedule



///*  into helper function doc??... for loading schedueled Events from DB - remake for this week
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

export function getTodaysEvents(lists: ScheduledList[]): ScheduledList[] {
  const updatedEventsToCurrentWeek: ScheduledList[] = updateScheduledListsDatesToCurrentWeek(lists)
  const currentDayOfTheWeek = new Date().getDay()
  const todaysEvents = updatedEventsToCurrentWeek.filter(event => {
    const eventDay = event.start?.getDay()
    return eventDay === currentDayOfTheWeek
  })
  return todaysEvents
}

const getCurrentEvent = (events: ScheduledList[]) => {
  const now = new Date()
  for (let event of events) {
    if (event.start <= now && event.end >= now) return event
  }
  return null
}
