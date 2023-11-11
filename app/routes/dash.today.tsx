// import { parse } from 'querystring'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useRouteLoaderData } from '@remix-run/react'
import { type LoaderArgs } from '@remix-run/server-runtime'
import type { LinksFunction } from '@remix-run/react/dist/routeModules'

import styleSheet from "~/styles/SchedulerCss.css";
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import Today from '~/components/today/Today'
import HeadingH2 from '~/components/titles/HeadingH2'
import HeadingH3 from '~/components/titles/HeadingH3'
import HeadingH5 from '~/components/titles/HeadingH5'
import { requireUserId } from '~/models/session.server'
import { getScheduledItems } from '~/models/scheduler.server'
import SubHeading14px from '~/components/titles/SubHeading14px'
import { getAllMiscAndSpecialLists } from '~/models/list.server'
import TwoToneSubHeading from '~/components/titles/TwoToneSubHeading'
import ThreeParaFlex from '~/components/baseContainers/ThreeParaFlex'
import { getAllMiscAndSpecialRoutines } from '~/models/routines.server'
import DisplayCurrentEvent from '~/components/today/DisplayCurrentEvent'
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG'
import DisplayImportantLists from '~/components/today/DisplayImportantLists'
import { getDesiresWithOutcomesListsRoutines } from '~/models/desires.server'
import { updateScheduledListsDatesToCurrentWeek, useGetLoadedDesiresWithAll, useGetLoadedLists, useGetLoadedRoutines, useGetLoadedScheduledItems } from './dash.schedule'

import type { ScheduledItem } from '@prisma/client'
import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndTasks } from '~/types/routineTypes'
import type { OutcomeWithListsWithStrDates } from '~/types/outcomeTypes'
import type { DesireWithOutcomesAndAll, DesireWithOutcomesAndListsWithStrDates, DesireWithStringDates } from '~/types/desireTypes'


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styleSheet }];

export const loader = async ({ request }: LoaderArgs) => {
  try {
    const userId = await requireUserId(request);
    const loadedScheduledItems = await getScheduledItems(userId)
    const loadedMiscAndSpecialLists = await getAllMiscAndSpecialLists(userId);
    const loadedMiscAndSpecialRoutines = await getAllMiscAndSpecialRoutines(userId);
    const loadedDesiresWithOutcomesListsRoutines = await getDesiresWithOutcomesListsRoutines(userId);

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


const path = 'routes/dash.today'


//use memo???

function TodayPage() {

  const currentDate = format(new Date(), 'EEE, MMMM d');
  const [currentEvent, setCurrentEvent] = useState<ScheduledItem>()
  const [todaysEventList, setTodaysEventList] = useState<ScheduledItem[]>()

  const todaysScheduledEventList = useGetTodaysItems()
  const miscAndSpecialLists: ListAndToDos[] = useGetLoadedLists(path)
  const miscAndSpecialRoutines: RoutineAndTasks[] = useGetLoadedRoutines(path)
  const desiresAndAll: DesireWithOutcomesAndAll[] = useGetLoadedDesiresWithAll(path)

  useEffect(() => {
    if (!todaysScheduledEventList) return
    setTodaysEventList(todaysScheduledEventList)
  }, [todaysScheduledEventList])

  const updateCurrentEvent = () => {
    if (!todaysEventList || todaysEventList.length === 0) return
    console.log('updating')
    setCurrentEvent(GetCurrentEvent(todaysEventList))
  }

  useEffect(() => {
    if (!todaysEventList || todaysEventList.length === 0) return
    setCurrentEvent(GetCurrentEvent(todaysEventList))
  }, [todaysEventList])

  useEffect(() => {
    if (!todaysEventList || todaysEventList.length === 0) return
    const intervalId = setInterval(updateCurrentEvent, 1000 * 120);
    return () => clearInterval(intervalId);
  },);


  const { mainDesire, mainOutcome } = useGetMainFocus()


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
                loadedLists={miscAndSpecialLists}
              />
            </div>

            <div className='flex flex-wrap gap-8 mt-8'>
              <div className='w-[400px]  ' >
                <HeadingH2 text={`Today: ${currentDate}`} />
                <Today
                  scheduledItems={todaysEventList}
                  miscAndSpecialLists={miscAndSpecialLists}
                  miscAndSpecialRoutines={miscAndSpecialRoutines}
                  desiresAndAll={desiresAndAll}
                />
              </div>

              <div className='  '>
                <HeadingH2 text={`Current Time Block`} />
                <div>
                  {currentEvent && (
                    <DisplayCurrentEvent
                      event={currentEvent}
                      loadedLists={miscAndSpecialLists}
                      loadedRoutines={miscAndSpecialRoutines}
                      loadedDesiresAndAll={desiresAndAll}
                    />
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


export function getTodaysEvents(lists: ScheduledItem[]): ScheduledItem[] {
  const updatedEventsToCurrentWeek: ScheduledItem[] = updateScheduledListsDatesToCurrentWeek(lists)
  const currentDayOfTheWeek = new Date().getDay()
  const todaysEvents = updatedEventsToCurrentWeek.filter(event => {
    const eventDay = event.start?.getDay()
    return eventDay === currentDayOfTheWeek
  })
  return todaysEvents
}

function GetCurrentEvent(events: ScheduledItem[]) {
  const now = new Date()
  const currentEvent = events.find(event => (event.start <= now && event.end >= now))
  return currentEvent
}


export const useGetTodaysLoaders = () => {
  const loaderData = useRouteLoaderData(path);
  return loaderData;
};


export const useGetTodaysItems = () => {
  const [todaysItems, setTodaysItems] = useState<ScheduledItem[]>([])
  const loadedScheduledItems = useGetLoadedScheduledItems(path)

  useEffect(() => {
    if (!loadedScheduledItems) return
    const todaysItems = getTodaysEvents(loadedScheduledItems)
    setTodaysItems(todaysItems)
  }, [loadedScheduledItems])

  return todaysItems
}


export const useGetMainFocus = () => {
  const [mainDesire, setMainDesire] = useState<DesireWithStringDates | null>(null)
  const [mainOutcome, setMainOutcome] = useState<OutcomeWithListsWithStrDates | null>(null)
  const { loadedDesiresWithOutcomes }: { loadedDesiresWithOutcomes: DesireWithOutcomesAndListsWithStrDates[] } = useGetTodaysLoaders();

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