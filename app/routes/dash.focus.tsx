import { useEffect, useState } from 'react';
import { useRouteLoaderData } from '@remix-run/react';
import { redirect, type LoaderFunctionArgs } from '@remix-run/server-runtime'

import { getMainFocus } from '~/models/desires.server';
import { requireUserId } from '~/models/session.server';
import H1WithLink from '~/components/titles/H1WithLink';
import HabitBadges from '~/components/habits/HabitBadges';
import { getMonthlyAmount } from '~/models/clarifying.server';
import SavingsBadges from '~/components/savings/SavingsBadges';
import TwoToneSubHeading from '~/components/titles/TwoToneSubHeading';
import ThreeParaFlex from '~/components/baseContainers/ThreeParaFlex';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';
import SubHeading16WithLink from '~/components/titles/SubHeading16WithLink';
import DisplayListsOrRoutines from '~/components/list/DisplayListsOrRoutines';
import MilestoneGroupsDisplay from '~/components/milestones/MilestoneGroupsDisplay';
import { ArrayOfObjectsStrToDates, ObjectStrToDates } from '~/components/utilities/helperFunctions';

import type { DesireWithStringDates } from '~/types/desireTypes';
import type { ListAndTodosWithStrDates } from '~/types/listTypes';
import type { Habit, HabitDate, MilestoneGroup } from '@prisma/client';
import type { RoutineAndTasksWithStrDates } from '~/types/routineTypes';
import type { OutcomeWithAllWithStringDates } from '~/types/outcomeTypes';
import type { SavingsAndPaymentsWithStrDates } from '~/types/savingsType';
import type { HabitWithDates, HabitWithDatesWithStrDates } from '~/types/habitTypes';
import type { MilestoneGroupsWithMilestones, MilestoneGroupsWithMilestonesWithStringDates } from '~/types/milestoneTypes';


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let userId = await requireUserId(request);
  try {
    const main = await getMainFocus(userId);
    if (!main) redirect('/dash')
    const monthlyAmt = await getMonthlyAmount(userId);
    return { main, monthlyAmt }

  } catch (error) { return 'failure' }
}


function MainFocusPage() {

  // const loaderData = useGetLoaderData()
  const lists = useGetLists()
  const routines = useGetRoutines()
  const habits = useGetHabitTrackers()
  const savings = useGetSavings()
  const milestoneGroups = useGetMilestoneGroups()
  const desireTitle: string | undefined | null = useGetDesireTitle()
  const outcomeWithAll: OutcomeWithAllWithStringDates | undefined | null = useGetOutcomeWithAll()

  const monthlyAmount = useGetMonthlyAmount()

  const title = outcomeWithAll?.title || ''
  const vision = outcomeWithAll?.vision || ''
  const description = outcomeWithAll?.description || ''

  const desireId = outcomeWithAll?.desireId || ''
  const outcomeId = outcomeWithAll?.id || ''

  const linkToOutcome = `/dash/desires/${desireId}/outcomes/${outcomeId}`


  // let { warning, alertMessage } = useInvalidItemIdAlertAndRedirect({ loaderData: outcomeWithAll, itemType: 'Outcome' })


  return (
    <>
      <BasicTextAreaBG pageTitle='Main Focus'>
        {/* //?  THE TITLE SECTION  */}
        <section>
          <H1WithLink
            title={title || ''}
            linkText={'Edit Outcome Details'}
            linkDestination={'edit'}
            maxWidthTW={'max-w-full'}
          />

          <TwoToneSubHeading
            staticHeading='For the Desire'
            variableHeadingsArray={[desireTitle]}
            size='14px'
          />
        </section>

        <article className='w-full flex flex-col gap-y-12 mt-0' >

          {/* //**********************  PARAGRAPHS *********************************** */}
          <section>
            {/* //?  PARAGRAPHS  */}
            <ThreeParaFlex
              title1={'The Desired Outcome'}
              textParagraph1={description || ''}
              title2={'The Vision'}
              textParagraph2={vision || ''}
            />
          </section>

          {/* //**********************  LIMITING BELIEFS *********************************** */}
          <section className='mt-[-24px]  '>
            <SubHeading16WithLink title={' Notes'} linkText={'Go To'} linkDestination={`${linkToOutcome}/notes`} />
            No Notes
          </section>

          {/* //**********************  NOTES *********************************** */}
          <section className=' '>
            <SubHeading16WithLink title={'Limiting Beliefs'} linkText={'Go To'} linkDestination={`${linkToOutcome}/limitingbeliefs`} />
            No Limiting Beliefs Identified
          </section>


          {/* //**********************  HABIT TRACKERS *********************************** */}
          <section>
            <SubHeading16WithLink title={'Habit Trackers'} linkText={'Go To'} linkDestination={`${linkToOutcome}/habits`} />
            <HabitBadges habits={habits} />
          </section>


          {/* //**********************  LISTS *********************************** */}
          <section>
            <SubHeading16WithLink title={'Lists'} linkText={'Go To'} linkDestination={`${linkToOutcome}/lists`} />
            <DisplayListsOrRoutines lists={lists} />
          </section>



          {/* //**********************  MILESTONES *********************************** */}
          <section className='w-full  '>
            <SubHeading16WithLink title={'Milestones'} linkText={'Go To'} linkDestination={`${linkToOutcome}/milestonegroups`} />
            {milestoneGroups && (
              <MilestoneGroupsDisplay milestoneGroups={milestoneGroups} />
            )}
          </section>





          {/* //**********************  ROUTINES *********************************** */}
          <section>
            <SubHeading16WithLink title={'Routines'} linkText={'Go To'} linkDestination={`${linkToOutcome}/routines`} />
            <DisplayListsOrRoutines lists={routines} />
          </section>


          {/* //**********************  SAVINGS *********************************** */}
          <section>
            <SubHeading16WithLink title={'Savings Trackers'} linkText={'Go To'} linkDestination={`${linkToOutcome}/savings`} />
            <SavingsBadges savings={savings} monthlyAmount={monthlyAmount} />
          </section>
        </article>

      </BasicTextAreaBG >
    </>
  )
}
export default MainFocusPage


type MainFocusWithAllWithStrDates = DesireWithStringDates & {
  outcomes: OutcomeWithAllWithStringDates[] | undefined | null;
};

type LoaderData = {
  main: MainFocusWithAllWithStrDates | undefined | null;
  monthlyAmt: number;
}



export const useGetLoaderData = (path = `routes/dash.focus`) => {
  const loadedData = useRouteLoaderData(path)
  const [mainFocus, setMainFocus] = useState<MainFocusWithAllWithStrDates | undefined | null>()
  const [amount, setAmount] = useState<number | undefined | null>()

  useEffect(() => {
    if (!loadedData || loadedData === undefined) return
    const data = loadedData as LoaderData
    if (!data) return
    const { main, monthlyAmt } = data
    setMainFocus(main)
    setAmount(monthlyAmt)
  }, [loadedData])

  return { mainFocus, amount }
}

//?  ************************************  CUSTOM HOOKS  ************************************
export const useGetOutcomeWithAll = (): OutcomeWithAllWithStringDates | undefined | null => {
  const { mainFocus } = useGetLoaderData()
  const [outcomeWithAll, setOutcomeWithAll] = useState<OutcomeWithAllWithStringDates | undefined | null>()

  useEffect(() => {
    if (mainFocus === undefined) return setOutcomeWithAll(undefined)
    if (!mainFocus) return setOutcomeWithAll(null)
    const outcomes = 'outcomes' in mainFocus ? mainFocus.outcomes : undefined;
    if (outcomes && outcomes.length > 0) {
      setOutcomeWithAll(outcomes[0]);
    }
  }, [mainFocus]);

  return outcomeWithAll
}


export const useGetLists = (): ListAndTodosWithStrDates[] => {
  const outcomeWithAll = useGetOutcomeWithAll() as OutcomeWithAllWithStringDates
  const { lists } = outcomeWithAll || []
  return lists
}


export const useGetRoutines = (): RoutineAndTasksWithStrDates[] => {
  const outcomeWithAll = useGetOutcomeWithAll() as OutcomeWithAllWithStringDates
  const { routines } = outcomeWithAll || []
  return routines
}


const useGetSavings = (): SavingsAndPaymentsWithStrDates[] => {
  const outcomeWithAll = useGetOutcomeWithAll() as OutcomeWithAllWithStringDates
  const { savings } = outcomeWithAll || []
  return savings
}


export const useGetMilestoneGroups = (): MilestoneGroupsWithMilestones[] => {
  const outcomeWithAll = useGetOutcomeWithAll() as OutcomeWithAllWithStringDates
  const { milestoneGroup } = outcomeWithAll || []
  const [milestoneGroupWithMilestones, setMilestoneGroupWithMilestones] = useState<MilestoneGroupsWithMilestones[]>([])

  useEffect(() => {
    if (!milestoneGroup) return
    const milesonteGroupsArray = milestoneGroup as MilestoneGroupsWithMilestonesWithStringDates[]
    if (milesonteGroupsArray.length === 0) return

    const groupsWithProperDates = milesonteGroupsArray.map((group: MilestoneGroupsWithMilestonesWithStringDates) => {
      const { milestones, ...rest } = group
      const milestonesWithProperDates = ArrayOfObjectsStrToDates({ items: milestones, dateKeys: ['createdAt', 'updatedAt', 'dueDate', 'completedAt'] }) as unknown as MilestoneGroup
      const groupWithProperDates = ObjectStrToDates({ item: rest, dateKeys: ['createdAt', 'updatedAt'] }) as unknown as MilestoneGroup
      return { ...groupWithProperDates, milestones: milestonesWithProperDates }
    })

    setMilestoneGroupWithMilestones(groupsWithProperDates as unknown as MilestoneGroupsWithMilestones[])
  }, [milestoneGroup])

  return milestoneGroupWithMilestones
}


export const useGetHabitTrackers = (): HabitWithDates[] => {
  const outcomeWithAll = useGetOutcomeWithAll() as OutcomeWithAllWithStringDates
  const { habits } = outcomeWithAll || []
  const [habitsWithStreaks, setHabitsWithStreaks] = useState<HabitWithDates[]>([])

  useEffect(() => {
    if (!habits) return
    if (habits.length === 0) return

    const habitsWithProperDates = habits.map((habit: HabitWithDatesWithStrDates) => {
      const { habitDates, ...rest } = habit
      const habitDatesWithProperDates = ArrayOfObjectsStrToDates({ items: habitDates, dateKeys: ['createdAt', 'updatedAt'] }) as unknown as HabitDate[]
      const habitWithProperDates = ObjectStrToDates({ item: rest, dateKeys: ['createdAt', 'updatedAt', 'startDate'] }) as unknown as Habit
      return { ...habitWithProperDates, habitDate: habitDatesWithProperDates }
    })

    setHabitsWithStreaks(habitsWithProperDates)
  }, [habits])

  return habitsWithStreaks
}

export const useGetDesireTitle = (): string | undefined | null => {
  const { mainFocus } = useGetLoaderData()
  const [title, setTitle] = useState<string | undefined | null>()

  useEffect(() => {
    if (mainFocus === undefined) return
    if (!mainFocus) return setTitle(null)
    setTitle(mainFocus?.title || '')
  }, [mainFocus])

  return title
}

export const useGetMonthlyAmount = (): number | undefined | null => {
  const { amount } = useGetLoaderData()
  const [monthlyAmount, setMonthlyAmount] = useState<number | undefined | null>()

  useEffect(() => {
    if (amount === undefined) return
    if (!amount) return setMonthlyAmount(null)
    setMonthlyAmount(amount)
  }, [amount])

  return monthlyAmount

}



