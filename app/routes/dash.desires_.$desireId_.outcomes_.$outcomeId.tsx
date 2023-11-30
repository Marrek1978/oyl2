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
import { ObjectStrToDates } from '~/components/utilities/helperFunctions'
import useInvalidItemIdAlertAndRedirect from '~/components/modals/InvalidItemIdAlertAndRedirect'
import { getOutcomeWithMilestonesListsRoutinesHabitsSavingsById, updateOutcome } from '~/models/outcome.server'

import type { Outcome } from '@prisma/client'
import type { OutcomeWithAll, OutcomeWithAllWithStringDates } from '~/types/outcomeTypes'
import type { DesireWithStringDates, validationErrorsTypes } from '~/types/desireTypes'


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let userId = await requireUserId(request);
  const { desireId, outcomeId } = params
  if (!desireId) return redirect('../..')
  if (!outcomeId) return redirect('../..')
  try {
    const desire = await getDesireById(desireId, userId);
    console.log("🚀 ~ file: dash.desires_.$desireId_.outcomes_.$outcomeId.tsx:32 ~ loader ~ desire:", desire)
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
  const outcomeWithAll: OutcomeWithAll | undefined | null = useGetOutcomeWithAll()
  const desireTitle: string | undefined | null = useGetDesireTitle()

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

          <section className='w-full flex flex-col gap-y-6'>
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

            <div className=' grid grid-cols-[250px,_100px] items-baseline'>
              <SubHeading14px text={'Savings Trackers'} />
              <Link to='milestones'>
                <BtnWithProps
                  btnPurpose={'goto'}
                  textSizeTW={'sm'}
                  fontWidthTW={'bold'}
                  btnLabel={'Go To'}
                />
              </Link>
            </div>
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
  console.log("🚀 ~ file: dash.desires_.$desireId_.outcomes_.$outcomeId.tsx:214 ~ loaderData:", loaderData)
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


export const useGetOutcomeWithAll = (): OutcomeWithAll | undefined | null => {

  const { outcomeWithStrDates } = useGetOutcomeIdLoaderData()
  const [outcomeWithAll, setOutcomeWithAll] = useState<OutcomeWithAll | undefined | null>()

  useEffect(() => {
    if (outcomeWithStrDates === undefined) return
    if (!outcomeWithStrDates) return setOutcomeWithAll(null)
    const { habitTrackers, lists, milestoneGroup, routines, savingsTrackers, ...restWithStrDates } = outcomeWithStrDates
    const outcomeWithProperDates = ObjectStrToDates({ item: restWithStrDates, dateKeys: ['createdAt', 'updatedAt'] })
    setOutcomeWithAll(outcomeWithProperDates)
  }, [outcomeWithStrDates])

  return outcomeWithAll
}


export const useGetOutcomeOnlyWithProperDates = (): Outcome | undefined => {
  const { outcomeWithStrDates } = useGetOutcomeIdLoaderData()
  const [outcomeOnly, setOutcomeOnly] = useState<Outcome>()

  useEffect(() => {
    if (!outcomeWithStrDates) return
    const { habitTrackers, lists, milestoneGroup, routines, savingsTrackers, ...restWithStrDates } = outcomeWithStrDates
    const outcomeWithProperDates = ObjectStrToDates({ item: restWithStrDates, dateKeys: ['createdAt', 'updatedAt'] })
    setOutcomeOnly(outcomeWithProperDates)
  }, [outcomeWithStrDates])

  return outcomeOnly
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




