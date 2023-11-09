// import { parse } from 'querystring'
import { format } from 'date-fns'
import { useRouteLoaderData } from '@remix-run/react'
import { useEffect, useState } from 'react'
import type { LinksFunction } from '@remix-run/react/dist/routeModules'
import { type LoaderArgs } from '@remix-run/server-runtime'

import styleSheet from "~/styles/SchedulerCss.css";
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import HeadingH2 from '~/components/titles/HeadingH2'
import { requireUserId } from '~/models/session.server'
import { getAllRoutines } from '~/models/routines.server'
import { getAllListsAndTodos } from '~/models/list.server'
import { getScheduledItems } from '~/models/scheduler.server'
import { ArrayOfObjectsStrToDates, ObjectStrToDates } from '~/components/utilities/helperFunctions'

import Today from '~/components/today/Today'
import HeadingH3 from '~/components/titles/HeadingH3'
import HeadingH5 from '~/components/titles/HeadingH5'
import { getDesiresAndOutcomesWithLists } from '~/models/desires.server'
import SubHeading14px from '~/components/titles/SubHeading14px'
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG'

import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndTasks } from '~/types/routineTypes'
import type { ScheduledItem } from '@prisma/client'
import DisplayCurrentEvent from '~/components/today/DisplayCurrentEvent'
import type { OutcomeWithLists, OutcomeWithListsWithStrDates } from '~/types/outcomeTypes'
import type { DesireWithOutcomesAndListsWithStrDates, DesireWithStringDates } from '~/types/desireTypes'
import TwoToneSubHeading from '~/components/titles/TwoToneSubHeading'
import ThreeParaFlex from '~/components/baseContainers/ThreeParaFlex'
import DisplayImportantLists from '~/components/today/DisplayImportantLists'
import { ChangeListArrayDates } from './dash.listsandroutines'


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styleSheet }];

export const loader = async ({ request }: LoaderArgs) => {
  try {
    const userId = await requireUserId(request);
    const loadedLists = await getAllListsAndTodos(userId); //! get all and filter on client
    const loadedRoutines = await getAllRoutines(userId);//! get all and filter on client
    const scheduledItems = await getScheduledItems(userId)
    const loadedDesiresWithOutcomes = await getDesiresAndOutcomesWithLists(userId)
    return ({ loadedLists, loadedRoutines, scheduledItems, loadedDesiresWithOutcomes });
  } catch (error) {
    throw error
  }
}


//use memo???

function TodayPage() {

  const [currentEvent, setCurrentEvent] = useState<ScheduledItem | null>(null)

  const currentDate = format(new Date(), 'EEE, MMMM d');

  const todaysEventList = useGetTodaysItems()
  const allUserLists: ListAndToDos[] = useGetLoadedUsersLists()
  const allUserRoutines: RoutineAndTasks[] = useGetLoadedUsersRoutines()
  const allUserOutcomes: OutcomeWithLists[] = useGetLoadedUserOutcomes()


  useEffect(() => {
    const updateCurrentEvent = () => setCurrentEvent(getCurrentEvent(todaysEventList));
    const intervalId = setInterval(updateCurrentEvent, 1000 * 60);
    updateCurrentEvent();
    return () => clearInterval(intervalId);
  }, [todaysEventList]);


  const { mainDesire, mainOutcome } = useGetMainFocus()
  console.log("🚀 ~ file: dash.today.tsx:73 ~ TodayPage ~ mainOutcome:", mainOutcome)
  console.log("🚀 ~ file: dash.today.tsx:73 ~ TodayPage ~ mainDesire:", mainDesire)


  return (
    <>
      <article>

        <BasicTextAreaBG pageTitle={'Main Focus Today'} >
          <div className='flex flex-wrap flex-col gap-8 w-full  '>
            <div className='mt-8 w-full bg-base-300'>
              TimeLIne
            </div>

            <div>
              <TwoToneSubHeading
                staticHeading='Outcome to Focus On'
                variableHeadingsArray={[mainOutcome?.title || '']}
                size='14px'
              />
              <TwoToneSubHeading
                staticHeading='For Desire'
                variableHeadingsArray={[mainDesire?.title || '']}
                size='14px'
              />
            </div>


            <ThreeParaFlex
              title1={"Outcome's Vision"}
              textParagraph1={mainOutcome?.vision || ''}
              // linkDestination1={'editDetails'}
              // linkText1={'Edit Desire Description'}
              title2={"Desire's Vision"}
              textParagraph2={mainDesire?.ideal || ''}
              // linkDestination2={'editCurrent'}
              // linkText2={current?.length ? current : DesireCurrentDefaultText}
              title3={"Life's Vision"}
              textParagraph3={'vision here'}
            // linkDestination3={'editIdeal'}
            // linkText3={'Edit Ideal Scenario'}
            />


            <div className='w-full'>
              <DisplayImportantLists
                loadedLists={allUserLists}
              />
            </div>

            <div className='flex flex-wrap gap-8 mt-8'>
              <div className='w-[400px]  ' >
                <HeadingH2 text={`Today: ${currentDate}`} />
                <Today
                  scheduledItems={todaysEventList}
                  loadedLists={allUserLists}
                  loadedRoutines={allUserRoutines}
                />
              </div>

              <div className='  border-2 border-red-600'>
                <HeadingH2 text={`Current Time Block`} />
                <div>
                  {currentEvent && (
                    <DisplayCurrentEvent
                      event={currentEvent}
                      loadedLists={allUserLists}
                      loadedRoutines={allUserRoutines}
                      loadedOutcome={allUserOutcomes} />
                  )}
                </div>
              </div>
            </div>


            remake the outcome page here?

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
                      {/* <RoutinesDisplayToday routines={focusRoutines} /> */}
                    </div>
                    <div>
                      <HeadingH3 text="Lists" />
                      {/* <ListsDisplayToday lists={focusLists} /> */}
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
              </div>
            </div>
          </div>
        </BasicTextAreaBG>
      </article >
    </>
  )
}


export default TodayPage



///*  into helper function doc??... for loading schedueled Events from DB - remake for this week
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

export function getTodaysEvents(lists: ScheduledItem[]): ScheduledItem[] {
  const updatedEventsToCurrentWeek: ScheduledItem[] = updateScheduledListsDatesToCurrentWeek(lists)
  const currentDayOfTheWeek = new Date().getDay()
  const todaysEvents = updatedEventsToCurrentWeek.filter(event => {
    const eventDay = event.start?.getDay()
    return eventDay === currentDayOfTheWeek
  })
  return todaysEvents
}

const getCurrentEvent = (events: ScheduledItem[]) => {
  const now = new Date()
  for (let event of events) {
    if (event.start <= now && event.end >= now) return event
  }
  return null
}

export const useGetTodaysLoaders = () => {
  const path = 'routes/dash.today'
  const loaderData = useRouteLoaderData(path);
  return loaderData;
};

export const useGetLoadedScheduledItems = () => {
  const [items, setItems] = useState<ScheduledItem[]>([])
  const { scheduledItems } = useGetTodaysLoaders();

  useEffect(() => {
    if (!scheduledItems) return
    const itemsWithProperDates = ArrayOfObjectsStrToDates({ items: scheduledItems, dateKeys: ['createdAt', 'updatedAt'] })
    setItems(itemsWithProperDates)
  }, [scheduledItems])

  return items
}


export const useGetTodaysItems = () => {
  const [todaysItems, setTodaysItems] = useState<ScheduledItem[]>([])
  const loadedScheduledItems = useGetLoadedScheduledItems()

  useEffect(() => {
    if (!loadedScheduledItems) return
    const todaysItems = getTodaysEvents(loadedScheduledItems)
    setTodaysItems(todaysItems)
  }, [loadedScheduledItems])

  return todaysItems
}


export const useGetLoadedUsersLists = (): ListAndToDos[] => {
  const [lists, setLists] = useState<ListAndToDos[]>([])
  const { loadedLists } = useGetTodaysLoaders();

  useEffect(() => {
    if (!loadedLists) return
    const listsWithProperDates = ChangeListArrayDates(loadedLists)
    setLists(listsWithProperDates)
  }, [loadedLists])

  return lists
}


export const useGetLoadedUsersRoutines = (): RoutineAndTasks[] => {
  const [routines, setRoutines] = useState<RoutineAndTasks[]>([])
  const { loadedRoutines } = useGetTodaysLoaders();

  useEffect(() => {
    if (!loadedRoutines) return
    const routinesWithProperDates = ArrayOfObjectsStrToDates({ items: loadedRoutines, dateKeys: ['createdAt', 'updatedAt'] })
    setRoutines(routinesWithProperDates)
  }, [loadedRoutines])

  return routines
}


export const useGetLoadedUserOutcomes = (): OutcomeWithLists[] => {
  const [outcomes, setOutcomes] = useState<OutcomeWithLists[]>([])
  const { loadedDesiresWithOutcomes }: { loadedDesiresWithOutcomes: DesireWithOutcomesAndListsWithStrDates[] } = useGetTodaysLoaders();

  useEffect(() => {
    if (!loadedDesiresWithOutcomes) return
    const outcomesWithListsArray: OutcomeWithLists[] = loadedDesiresWithOutcomes.flatMap((desire) => {
      let desireOutcomesWithLists: OutcomeWithListsWithStrDates[] = desire.outcomes

      if (desireOutcomesWithLists && desireOutcomesWithLists.length > 0) {
        return desireOutcomesWithLists.map((outcome) => {
          const outcomeWithProperDates: OutcomeWithLists = ObjectStrToDates({ item: outcome, dateKeys: ['createdAt', 'updatedAt'] })
          let listsWithProperDates: ListAndToDos[] = [];
          if (outcomeWithProperDates.lists && outcomeWithProperDates.lists.length > 0) {
            listsWithProperDates = ArrayOfObjectsStrToDates({ items: outcomeWithProperDates.lists, dateKeys: ['createdAt', 'updatedAt'] })
              .map(list => ({ ...list }));  // Add empty todos array to each list
          }

          return {
            ...outcomeWithProperDates,   // This will spread the outcome properties
            lists: listsWithProperDates  // This will add the lists property
          };
        })
      }
      return []
    })
    setOutcomes(outcomesWithListsArray)
  }, [loadedDesiresWithOutcomes])

  return outcomes
}


export const useGetMainFocus = () => {
  const { loadedDesiresWithOutcomes }: { loadedDesiresWithOutcomes: DesireWithOutcomesAndListsWithStrDates[] } = useGetTodaysLoaders();
  const [mainDesire, setMainDesire] = useState<DesireWithStringDates | null>(null)
  const [mainOutcome, setMainOutcome] = useState<OutcomeWithListsWithStrDates | null>(null)

  useEffect(() => {
    if (!loadedDesiresWithOutcomes) return

    const desireZero = loadedDesiresWithOutcomes.find((desire) => (desire.sortOrder === 0))
    if (!desireZero) return
    const { outcomes, ...desire } = desireZero
    setMainDesire(desire)

    const outcomeZero = desireZero.outcomes.find((outcome) => (outcome.sortOrder === 0))
    if (!outcomeZero) return
    setMainOutcome(outcomeZero)
  }, [loadedDesiresWithOutcomes])

  return { mainDesire, mainOutcome }
}