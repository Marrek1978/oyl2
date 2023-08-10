import { v4 as uuidv4 } from 'uuid';
import type { Desire } from '@prisma/client';
import { Outlet, useMatches, useParams } from '@remix-run/react';

import H1WithLink from '~/components/titles/H1WithLink';
import H2WithLink from '~/components/titles/H2WithLink';
import TextProseWidth from '~/components/text/TextProseWidth';
import SubHeading14px from '~/components/titles/SubHeading14px';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';
import { DesireCurrentDefaultText, DesireIdealPlaceholderText, DesireOutcomesDefaultText } from '~/components/utilities/PlaceHolderTexts';
import { requireUserId } from '~/models/session.server';
import { getDesireById } from '~/models/desires.server';

import { redirect, type LoaderArgs } from '@remix-run/server-runtime';
import type { DesireValues, DesireWithValues } from '~/types/desireTypes';
import SubHeading16px from '~/components/titles/SubHeading16px';

export const loader = async ({ request, params }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const desireId = params.desireId!
  try {
    const desire: DesireWithValues | null = await getDesireById(desireId, userId)
    return { desire };
  } catch (error) { throw error }
}

function DesirePage() {

  const params = useParams();
  const matches = useMatches();
  const desires: DesireWithValues[] = matches.find(match => match.id === 'routes/dash.desires')?.data.desires
  const desire: DesireWithValues | undefined = desires.find((desire: Desire) => desire.id === params.desireId)

  if (!desire) {
    redirect('/dash/desires');
    return null;
  }

  const desireValues: DesireValues['desireValues'] = desire.desireValues || []
  desireValues?.sort((a, b) => a.value.sortOrder - b.value.sortOrder)
  const { title, description, current, ideal } = desire || {};
  const plural = desireValues && desireValues.length > 1 ? 's' : '';

  return (
    <>
      <Outlet />
      <section className='flex gap-8 flex-wrap '>
        <div className=' flex-1 flex flex-col gap-6 w-prose max-w-max basis '>
          <div className='w-max'>
            <BasicTextAreaBG >
              <div className='text-success mb-2'>
                <SubHeading16px text='Desire' />
              </div>

              <H1WithLink
                title={title}
                linkDestination={'editDetails'}
                linkText={'Edit Desire Details'}
              />

              <div className=" flex flex-wrap mt-2 max-w-prose text-neutral-content">
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
                  text={description}
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
        </div>

        {/* //?  THE IDEAL SITUATION  */}
        <div className=''>
          <BasicTextAreaBG >
            <H2WithLink
              title={'The Ideal Scenario'}
              linkDestination={'editIdeal'}
              linkText={'Edit your Ideal Scenario'}
            />
            <div className='mt-2'>
              <TextProseWidth
                text={ideal?.length ? ideal : DesireIdealPlaceholderText}
              />
            </div>
          </BasicTextAreaBG >
        </div>

        {/* //?   Specific Outcomes */}
        <div className=''>
          <BasicTextAreaBG >
            <H2WithLink
              title={'What Specific Outcomes?'}
              linkDestination={'outcomes'}
              linkText={'Edit Specific Outcomes'}
            />
            <div className='mt-2'>
              <TextProseWidth
                text={ideal?.length ? ideal : DesireOutcomesDefaultText}
              />
            </div>
          </BasicTextAreaBG >
        </div>
      </section >
    </>
  )
}

export default DesirePage


