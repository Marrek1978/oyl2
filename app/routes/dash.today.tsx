// import { parse } from 'querystring'
import { format } from 'date-fns'
import { useLoaderData } from '@remix-run/react'
import { useEffect, useState, useMemo } from 'react'
import type { LinksFunction } from '@remix-run/react/dist/routeModules'
import { json, type LoaderArgs } from '@remix-run/server-runtime'

import styleSheet from "~/styles/SchedulerCss.css";
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import { getProjects } from '~/models/project.server'
import HeadingH2 from '~/components/titles/HeadingH2'
import { requireUserId } from '~/models/session.server'
import { getAllRoutines } from '~/models/routines.server'
import { getAllListAndTodos } from '~/models/list.server'
import { getScheduledLists } from '~/models/scheduler.server'
import { transformRoutineDataDates, transformToDoDataDates, transformScheduledListsDataDates, transformProjectDataDates, transformDesireWithOutcomesDataDates } from '~/components/utilities/helperFunctions'

import Today from '~/components/today/Today'
import HeadingH1 from '~/components/titles/HeadingH1'
import HeadingH3 from '~/components/titles/HeadingH3'
import HeadingH5 from '~/components/titles/HeadingH5'
import TextProseWidth from '~/components/text/TextProseWidth'
import { getDesiresAndOutcomes } from '~/models/desires.server'
import SubHeading14px from '~/components/titles/SubHeading14px'
import DisplayCurrentEvent from '~/components/today/DisplayCurrentEvent'
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG'
import DisplayImportantLists from '~/components/today/DisplayImportantLists'

import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndToDos } from '~/types/routineTypes'
import type {  DesireOutcome,Project, ScheduledList } from '@prisma/client'
import type { ProjectWithListsAndRoutines } from '~/types/projectTypes'
import type { DesireWithOutcomes } from '~/types/desireTypes'
import RoutinesDisplayToday from '~/components/routines/RoutinesDisplayToday'
import ListsDisplayToday from '~/components/list/ListsDisplayToday'

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styleSheet }];

export const loader = async ({ request }: LoaderArgs) => {
  try {
    const userId = await requireUserId(request);
    const loadedLists = await getAllListAndTodos(userId); //! get all and filter on client
    const loadedRoutines = await getAllRoutines(userId);//! get all and filter on client
    const loadedProjects = await getProjects(userId);
    const scheduledLists = await getScheduledLists(userId)
    const loadedDesires: DesireWithOutcomes[] = await getDesiresAndOutcomes(userId)
    return json({ loadedLists, loadedRoutines, scheduledLists, loadedProjects, loadedDesires });
  } catch (error) {
    throw error
  }
}



function TodayPage() {

  const [currentEvent, setCurrentEvent] = useState<ScheduledList | null>(null)
  // const [clickedEvent, setClickedEvent] = useState<ScheduledList | null>(null)

  const currentDate = format(new Date(), 'EEE, MMMM d');
  // const currentTime = format(new Date(), 'HH:mm')

  const initialListsData = useLoaderData<typeof loader>();

  const loadedScheduledLists: ScheduledList[] = useMemo(() => transformScheduledListsDataDates(initialListsData.scheduledLists), [initialListsData.scheduledLists])
  const thisWeeksScheduledLists = useMemo(() => updateScheduledListsDatesToCurrentWeek(loadedScheduledLists), [loadedScheduledLists])
  const loadedLists: ListAndToDos[] = useMemo(() => transformToDoDataDates(initialListsData.loadedLists), [initialListsData.loadedLists]) //initialListsData.loadedToDos as ListAndToDos[
  const loadedProjects: Project[] = useMemo(() => transformProjectDataDates(initialListsData.loadedProjects), [initialListsData.loadedProjects]) //initialListsData.loadedProjects as Project[]
  const loadedRoutines: RoutineAndToDos[] = useMemo(() => transformRoutineDataDates(initialListsData.loadedRoutines), [initialListsData.loadedRoutines]) //initialListsData.loadedRoutines as RoutineAndToDos[]
  const loadedDesires: DesireWithOutcomes[] = useMemo(() => transformDesireWithOutcomesDataDates(initialListsData.loadedDesires), [initialListsData.loadedDesires]) //initialListsData.loadedRoutines as RoutineAndToDos[]

  const projectsWithListsAndRoutines: ProjectWithListsAndRoutines[] = loadedProjects.map(project => {
    const projectLists = loadedLists.filter(list => list.projectId === project.id)
    const projectRoutines = loadedRoutines.filter(routine => routine.projectId === project.id)
    return {
      ...project,
      lists: projectLists,
      routines: projectRoutines
    }
  })


  const focusProject: ProjectWithListsAndRoutines = projectsWithListsAndRoutines[0]
  const focusDesireId: string | null = focusProject?.desireId as string;
  const focusDesire: DesireWithOutcomes | undefined = loadedDesires?.find((desire) => (desire.id === focusDesireId))
  const focusOutcome: DesireOutcome | undefined = focusDesire?.desireOutcomes[0]
  const focusOutcomeId: string | undefined = focusOutcome?.id
  const focusLists: ListAndToDos[] | undefined = focusProject?.lists.filter(list => list.outcomeId === focusOutcomeId)
  const focusRoutines: RoutineAndToDos[] | undefined = focusProject?.routines.filter(routine => routine.outcomeId === focusOutcomeId)

  const todaysEventList = useMemo(() => getTodaysEvents(thisWeeksScheduledLists), [thisWeeksScheduledLists])


  useEffect(() => {
    const invervalId = setInterval(() => {
      setCurrentEvent(getCurrentEvent(todaysEventList))
    }, (1000 * 60));
    return () => clearInterval(invervalId)
  })


  useEffect(() => {
    setCurrentEvent(getCurrentEvent(todaysEventList))
  }, [todaysEventList])


  return (
    <>
      <article>

        <BasicTextAreaBG pageTitle={'Main Focus Today'} >
          <div className='flex flex-wrap flex-col gap-8 w-full  '>
            <div>
              <div className='text-base-content'>
                <HeadingH1 text={focusOutcome?.title || ''} />
              </div>

              <div className="flex gap-4 text-base-content/70">
                <div  >
                  <SubHeading14px text={'Project #1 : '} />
                </div>
                <div className='text-secondary/70'>
                  <SubHeading14px text={focusProject.title} />
                </div>
              </div>

              <div className="flex gap-4 text-base-content/70">
                <div  >
                  <SubHeading14px text={'For Desire : '} />
                </div>
                <div className='text-secondary/70'>
                  <SubHeading14px text={focusDesire?.title || ''} />
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-y-8 w-full '>
              <div className='flex flex-wrap gap-8 justify-between w-full'>
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
                      <RoutinesDisplayToday routines={focusRoutines} />
                    </div>
                    <div>
                      <HeadingH3 text="Lists" />
                      <ListsDisplayToday lists={focusLists} />
                    </div>

                    <div>
                      <HeadingH3 text="Habits" />
                      habits Dislay
                      <HeadingH5 text='Habit 1' />
                      <HeadingH5 text='Habit 2' />
                      <HeadingH5 text='Habit 3' />
                    </div>
                    <div>
                      <HeadingH3 text="$ Tracker" />
                      Tracker display
                      <HeadingH5 text='Tracker 1' />
                      <HeadingH5 text='Tracker 2' />
                      <HeadingH5 text='Tracker 3' />
                    </div>
                  </div>
                </div>

                <div className=' flex flex-wrap gap-8 flex-1 w-full justify-end  '>
                  <div className='w-prose max-w-prose'>
                    <HeadingH2 text="Outcome's Vision" />
                    <TextProseWidth text={focusOutcome?.vision || ''} />
                  </div>
                  <div className='w-prose max-w-prose'>
                    <HeadingH2 text="Desire's Vision" />
                    <TextProseWidth text={focusDesire?.ideal || ''} />
                  </div>
                  <div className='w-prose max-w-prose'>
                    <HeadingH2 text="Life's Vision" />
                    <TextProseWidth text={focusDesire?.ideal || ''} />
                  </div>
                </div>
              </div>
            </div>

            <div className='w-full'>
              <DisplayImportantLists
                loadedLists={loadedLists}
              />
            </div>

            <div className='flex flex-wrap gap-8 mt-8'>
              <div className='w-[400px]  ' >
                <HeadingH2 text={`Today: ${currentDate}`} />
                <Today
                  scheduledLists={todaysEventList}
                  loadedLists={loadedLists}
                  loadedRoutines={loadedRoutines}
                />
              </div>

              <div className='  border-2 border-red-600'>
                <HeadingH2 text={`Current Time Block`} />
                <div>
                  {currentEvent && (
                    <DisplayCurrentEvent
                      event={currentEvent}
                      loadedLists={loadedLists}
                      loadedRoutines={loadedRoutines}
                      loadedProjects={loadedProjects}
                    />
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


export default TodayPage



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
