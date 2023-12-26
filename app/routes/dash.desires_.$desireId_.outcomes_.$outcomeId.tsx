import { parse } from 'querystring'
import { useEffect, useState } from 'react'
import { useRouteLoaderData, Outlet, Link } from '@remix-run/react'
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/server-runtime'

import Modal from '~/components/modals/Modal'
import HeadingH1 from '~/components/titles/HeadingH1'
import { requireUserId } from '~/models/session.server'
import { getDesireById } from '~/models/desires.server'
import BtnWithProps from '~/components/buttons/BtnWithProps'
import SubHeading14px from '~/components/titles/SubHeading14px'
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs'
import ThreeParaFlex from '~/components/baseContainers/ThreeParaFlex'
import TwoToneSubHeading from '~/components/titles/TwoToneSubHeading'
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG'
import MilestoneGroupsDisplay from '~/components/milestones/MilestoneGroupsDisplay'
import useInvalidItemIdAlertAndRedirect from '~/components/modals/InvalidItemIdAlertAndRedirect'
import { ArrayOfObjectsStrToDates, ObjectStrToDates } from '~/components/utilities/helperFunctions'
import { getOutcomeWithMilestonesListsRoutinesHabitsSavingsById, updateOutcome } from '~/models/outcome.server'

import type { HabitWithStreaks, HabitWithStreaksWithStrDates } from '~/types/habitTypes'
import type { Habit, MilestoneGroup, Outcome, Streak } from '@prisma/client'
import type { OutcomeWithAllWithStringDates } from '~/types/outcomeTypes'
import type { DesireWithStringDates, validationErrorsTypes } from '~/types/desireTypes'
import type { MilestoneGroupsWithMilestones, MilestoneGroupsWithMilestonesWithStringDates } from '~/types/milestoneTypes'
import HabitBadge from '~/components/habits/HabitBadge'


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let userId = await requireUserId(request);
  const { desireId, outcomeId } = params
  if (!desireId) return redirect('../..')
  if (!outcomeId) return redirect('../..')
  try {
    const desire = await getDesireById(desireId, userId);
    if (!desire) return 'noId'
    const outcomeWithAll = await getOutcomeWithMilestonesListsRoutinesHabitsSavingsById(outcomeId)
    if (!outcomeWithAll) return null
    return {
      desire,
      outcomeWithAll
    };
  } catch (error) { throw error }
};



export const action = async ({ request }: ActionFunctionArgs) => {
  const formBody = await request.text();
  const outcomeData = JSON.parse(parse(formBody).outcomeString as string);

  let validationErrors: validationErrorsTypes = {};
  !outcomeData.title && (validationErrors.title = 'A title is required')
  !outcomeData.description && (validationErrors.description = 'A description is required')
  if (!outcomeData.title || !outcomeData.description) return validationErrors

  try {
    await updateOutcome(outcomeData)
    return redirect('..')
  } catch (error) { throw error }
}


function OutcomePage() {
  const outcomeWithAll: OutcomeWithAllWithStringDates | undefined | null = useGetOutcomeWithAll()
  const desireTitle: string | undefined | null = useGetDesireTitle()

  const milestoneGroups = useGetMilestoneGroups()
  const habits = useGetHabitTrackers()
  console.log("🚀 ~   ~ habits:", habits)

  let { warning, alertMessage } = useInvalidItemIdAlertAndRedirect({ loaderData: outcomeWithAll, itemType: 'Outcome' })

  const title = outcomeWithAll?.title || ''
  const vision = outcomeWithAll?.vision || ''
  const description = outcomeWithAll?.description || ''

  return (
    <>
      <Outlet />
      <BreadCrumbs secondCrumb={desireTitle || 'Desire'} title2={outcomeWithAll?.title || 'Outcome'} />
      {warning && (
        <Modal zIndex={50}>
          {alertMessage}
        </Modal>
      )}

      <BasicTextAreaBG pageTitle='Outcome'>

        {/* //?  THE TITLE SECTION  */}
        <section>
          <div className='
            mt-2 ml-[-2px] 
            flex flex-wrap w-full justify-between items-baseline
            '>
            <div className='flex-1'>
              <HeadingH1 H1Title={title || ''} />
            </div>
            <div className='flex-1 max-w-max'>
              <Link to='edit'>
                <BtnWithProps
                  btnPurpose={'goto'}
                  textSizeTW={'sm'}
                  fontWidthTW={'bold'}
                  btnLabel={'Edit Outcome Details'}
                />
              </Link>
            </div>
          </div>

          <TwoToneSubHeading
            staticHeading='Serves the Desire'
            variableHeadingsArray={[desireTitle]}
            size='14px'
          />
        </section>

        <article className='w-full flex flex-col gap-y-12'>
          <section>
            {/* //?  PARAGRAPHS  */}
            <ThreeParaFlex
              title1={'The Desired Outcome'}
              textParagraph1={description || ''}
              title2={'The Vision'}
              textParagraph2={vision || ''}

            />

          </section>


          <section className='w-full  '>
            <div className=' grid grid-cols-[250px,_100px] items-baseline'>
              <SubHeading14px text={'Milestones'} />
              <Link to='milestonegroups'>
                <BtnWithProps
                  btnPurpose={'goto'}
                  textSizeTW={'sm'}
                  fontWidthTW={'bold'}
                  btnLabel={'Go To'}
                />
              </Link>
            </div>

            {milestoneGroups && (
              <MilestoneGroupsDisplay milestoneGroups={milestoneGroups} />
            )}
          </section>


          <section>
            <div className=' grid grid-cols-[250px,_100px] items-baseline'>
              <SubHeading14px text={'Habit Trackers'} />
              <Link to='habits'>
                <BtnWithProps
                  btnPurpose={'goto'}
                  textSizeTW={'sm'}
                  fontWidthTW={'bold'}
                  btnLabel={'Go To'}
                />
              </Link>
            </div>

            <HabitBadge habits={habits} />
          </section>


          <section>

            <div className=' grid grid-cols-[250px,_100px] items-baseline'>
              <SubHeading14px text={'Lists'} />
              <Link to='lists'>
                <BtnWithProps
                  btnPurpose={'goto'}
                  textSizeTW={'sm'}
                  fontWidthTW={'bold'}
                  btnLabel={'Go To'}
                />
              </Link>
            </div>

            <div className=' grid grid-cols-[250px,_100px] items-baseline'>
              <SubHeading14px text={'Routines'} />
              <Link to='routines'>
                <BtnWithProps
                  btnPurpose={'goto'}
                  textSizeTW={'sm'}
                  fontWidthTW={'bold'}
                  btnLabel={'Go To'}
                />
              </Link>
            </div>



            <div className=' grid grid-cols-[250px,_100px] items-baseline'>
              <SubHeading14px text={'Savings Trackers'} />
              <Link to='savings'>
                <BtnWithProps
                  btnPurpose={'goto'}
                  textSizeTW={'sm'}
                  fontWidthTW={'bold'}
                  btnLabel={'Go To'}
                />
              </Link>
            </div>

            Notes &
            Limiting Beliefs

          </section>
        </article>
      </BasicTextAreaBG >
    </>
  )
}

export default OutcomePage

interface OutcomeWithAllWithStrDatesType {
  desireWithStrDates: DesireWithStringDates | undefined | null,
  outcomeWithStrDates: OutcomeWithAllWithStringDates | undefined | null
}

interface OutcomeWithAllType {
  desire: DesireWithStringDates | undefined | null,
  outcomeWithAll: OutcomeWithAllWithStringDates | undefined | null
}




export const useGetOutcomeIdLoaderData = (path = `routes/dash.desires_.$desireId_.outcomes_.$outcomeId`)
  : OutcomeWithAllWithStrDatesType => {

  const loaderData = useRouteLoaderData(path)
  const [desireWithStrDates, setDesireWithStrDates] = useState<DesireWithStringDates | undefined | null>()
  const [outcomeWithStrDates, setOutcomeWithStrDates] = useState<OutcomeWithAllWithStringDates | undefined | null>()

  useEffect(() => {
    if (loaderData === undefined) return
    if (loaderData === 'noId' || loaderData === null) {
      setDesireWithStrDates(null)
      setOutcomeWithStrDates(null)
      return
    }
    const { desire, outcomeWithAll } = loaderData as OutcomeWithAllType
    setDesireWithStrDates(desire)
    if (outcomeWithAll === null || outcomeWithAll === null) return
    setOutcomeWithStrDates(outcomeWithAll)
  }, [loaderData])

  return { desireWithStrDates, outcomeWithStrDates }
}

export const useGetOutcomeOnlyWithProperDates = (): Outcome | undefined => {
  const { outcomeWithStrDates } = useGetOutcomeIdLoaderData()
  const [outcomeOnly, setOutcomeOnly] = useState<Outcome>()

  useEffect(() => {
    if (!outcomeWithStrDates) return
    const { habits, lists, milestoneGroup, routines, savings, ...restWithStrDates } = outcomeWithStrDates
    const outcomeWithProperDates = ObjectStrToDates({ item: restWithStrDates, dateKeys: ['createdAt', 'updatedAt'] })
    setOutcomeOnly(outcomeWithProperDates)
  }, [outcomeWithStrDates])

  return outcomeOnly
}


//?  ************************************  CUSTOM HOOKS  ************************************
export const useGetOutcomeWithAll = (): OutcomeWithAllWithStringDates | undefined | null => {
  const { outcomeWithStrDates } = useGetOutcomeIdLoaderData()
  const [outcomeWithAll, setOutcomeWithAll] = useState<OutcomeWithAllWithStringDates | undefined | null>()
  useEffect(() => {
    if (outcomeWithStrDates === undefined) return
    if (!outcomeWithStrDates) return setOutcomeWithAll(null)
    setOutcomeWithAll(outcomeWithStrDates)
  }, [outcomeWithStrDates])

  return outcomeWithAll
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


export const useGetHabitTrackers = (): HabitWithStreaks[] => {
  const outcomeWithAll = useGetOutcomeWithAll() as OutcomeWithAllWithStringDates
  const { habits } = outcomeWithAll || []
  const [habitsWithStreaks, setHabitsWithStreaks] = useState<HabitWithStreaks[]>([])

  useEffect(() => {
    if(!habits) return
    if(habits.length === 0) return

    const habitsWithProperDates = habits.map((habit:HabitWithStreaksWithStrDates) => {
      const { streak, ...rest } = habit
      const streakWithProperDates = ArrayOfObjectsStrToDates({ items: streak, dateKeys: ['createdAt', 'updatedAt']  }) as unknown as Streak[]
      const habitWithProperDates = ObjectStrToDates({ item: rest, dateKeys: ['createdAt', 'updatedAt', 'startDate'] }) as unknown as Habit 
      return { ...habitWithProperDates, streak: streakWithProperDates }
    })

    setHabitsWithStreaks(habitsWithProperDates)

  }, [habits])


  return habitsWithStreaks
}

export const useGetDesireTitle = (): string | undefined | null => {
  const [title, setTitle] = useState<string | undefined | null>()
  const { desireWithStrDates } = useGetOutcomeIdLoaderData()

  useEffect(() => {
    if (desireWithStrDates === undefined) return
    if (!desireWithStrDates) return setTitle(null)
    setTitle(desireWithStrDates?.title || '')
  }, [desireWithStrDates])

  return title
}



