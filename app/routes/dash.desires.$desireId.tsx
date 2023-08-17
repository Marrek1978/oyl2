import { v4 as uuidv4 } from 'uuid';
import type { Desire, DesireOutcomeProgress } from '@prisma/client';
import { type LoaderArgs } from '@remix-run/server-runtime';
import { Outlet, useLoaderData, useMatches, useParams } from '@remix-run/react';

import H1WithLink from '~/components/titles/H1WithLink';
import H2WithLink from '~/components/titles/H2WithLink';
import TextProseWidth from '~/components/text/TextProseWidth';
import SubHeading14px from '~/components/titles/SubHeading14px';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';
import { DesireCurrentDefaultText, DesireIdealPlaceholderText } from '~/components/utilities/PlaceHolderTexts';

import { formatDate } from '~/utils/functions';
import { getOutcomesByDesireId } from '~/models/outcome.server';
import SubHeading16px from '~/components/titles/SubHeading16px';
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs';

import type { DesireValues, DesireWithValues } from '~/types/desireTypes';
import type { DesireOutcomeProgressWithStringDates, OutcomeWithProgessWithStringDates, OutcomeWithProgressList } from '~/types/outcomeTypes';


export const loader = async ({ request, params }: LoaderArgs) => {
  const desireId = params.desireId!
  try {
    const desireOutcomes = await getOutcomesByDesireId(desireId)
    return { desireOutcomes };
  } catch (error) { throw error }
}


function DesirePage() {
 
  const { desireOutcomes } = useLoaderData()

  const params = useParams();
  const matches = useMatches();
  const desires: DesireWithValues[] = matches.find(match => match.id === 'routes/dash.desires')?.data.desires
  const desire: DesireWithValues | undefined = desires.find((desire: Desire) => desire.id === params.desireId)

  const desireValues: DesireValues['desireValues'] = desire?.desireValues || []
  desireValues?.sort((a, b) => a.value.sortOrder - b.value.sortOrder)
  const { title, description, current, ideal } = desire || {};
  const plural = desireValues && desireValues.length > 1 ? 's' : '';

  const outcomes = desireOutcomes?.map((outcome: OutcomeWithProgessWithStringDates) => {
    const progressListWithDateDates = outcome.desireOutcomeProgress.map((progress: DesireOutcomeProgressWithStringDates) => {
      return {
        ...progress,
        createdAt: new Date(progress.createdAt),
        updatedAt: new Date(progress.updatedAt),
        dueDate: new Date(progress.dueDate)
      }
    })

    return {
      ...outcome,
      createdAt: new Date(outcome.createdAt),
      updatedAt: new Date(outcome.updatedAt),
      dueDate: new Date(outcome.dueDate),
      desireOutcomeProgress: progressListWithDateDates
    }
  })


  return (
    <>
      <BreadCrumbs title={title || ''} />
      <Outlet />
      <section className='flex gap-8 flex-wrap '>
        <div className=' flex-1 flex flex-col gap-6 w-prose max-w-max basis '>
          <div className='w-max'>
            <BasicTextAreaBG >
              <div className='text-success mb-2'>
                <SubHeading16px text='Desire' />
              </div>

              <H1WithLink
                title={title || ''}
                linkDestination={'editDetails'}
                linkText={'Edit Desire\'s Details'}
              />

              <div className=" flex flex-wrap mt-2 max-w-prose text-secondary/70">
                <SubHeading14px
                  text={`Aligned with the Value${plural} of : `}
                />

                {desireValues?.map((value) => {
                  const title = value.value.valueTitle
                  let id = uuidv4();
                  return (
                    <div key={id}>
                      <SubHeading14px text={` ${title}, `} />
                    </div>
                  )
                })
                }
              </div >
              <div className='mt-4'>
                <TextProseWidth
                  text={description || ''}
                />
              </div>
            </BasicTextAreaBG >
          </div>



          {/* //?  THE CURRENT SITUATION  */}
          <div className=''>
            <BasicTextAreaBG >
              <H2WithLink
                title={'Current Situation'}
                linkDestination={'editCurrent'}
                linkText={'Edit Current Situation'}
              />
              <div className='mt-2'>
                <TextProseWidth
                  text={current?.length ? current : DesireCurrentDefaultText}
                />
              </div>
            </BasicTextAreaBG >
          </div>



          {/* //?  THE IDEAL SITUATION  */}
          <div className=''>
            <BasicTextAreaBG >
              <H2WithLink
                title={'The Ideal Scenario'}
                linkDestination={'editIdeal'}
                linkText={'Edit Ideal Scenario'}
              />
              <div className='mt-2'>
                <TextProseWidth
                  text={ideal?.length ? ideal : DesireIdealPlaceholderText}
                />
              </div>
            </BasicTextAreaBG >
          </div>
        </div>


        {/* //?   Specific Outcomes */}
        <div className=''>
          <BasicTextAreaBG >
            <H2WithLink
              title={`Desired Outcome${plural}`}
              linkDestination={'outcomes'}
              linkText={'Edit Outcomes'}
            />
            <div className='mt-4'>
              <div className='max-w-prose w-prose' >

                {outcomes?.map((outcome: OutcomeWithProgressList) => {
                  const progressList = outcome.desireOutcomeProgress.map((progress: DesireOutcomeProgress) => {
                    const id = uuidv4();
                    return (
                      <div key={id}>
                        <div className='mt-2 flex justify-between font-medium text-base-content' >
                          {progress.title}
                          <div className='font-normal text-base-content/70'>
                            {progress.dueDate && <div className='text-sm  '>{formatDate(progress.dueDate)}</div>}
                          </div>
                        </div>
                      </div>
                    )
                  })

                  return (
                    <div key={outcome.id} className=' mt-8'>
                      <div className='flex justify-between'>
                        <SubHeading16px text={outcome.title} />
                        <div className='text-sm text-success font-medium '>{formatDate(outcome.dueDate)}</div>
                      </div>
                      <div className='max-h-12 overflow-hidden  text-base-content/70'>{outcome.description}</div>
                      <div>
                        {progressList}
                      </div>
                    </div>
                  )
                })}
              </div >
            </div>
          </BasicTextAreaBG >
        </div>
      </section >
    </>
  )
}

export default DesirePage


