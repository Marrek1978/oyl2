import { v4 as uuidv4 } from 'uuid';
import { Outlet, useMatches, useParams } from '@remix-run/react';

import H1WithLink from '~/components/titles/H1WithLink';
import H2WithLink from '~/components/titles/H2WithLink';
import BreadCrumb14px from '~/components/titles/BreadCrumb';
import TextProseWidth from '~/components/text/TextProseWidth';
import SubHeading14px from '~/components/titles/SubHeading14px';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';

// import type { DesireWithValues } from '~/types/desireTypes';
import type { Desire } from '@prisma/client';
import type { DesireValues, DesireWithValues } from '~/types/desireTypes';


function DesirePage() {

  const matches = useMatches();
  const params = useParams();
  const desires: DesireWithValues[] = matches.find(match => match.id === 'routes/dash.desires')?.data.desires
  const desire: DesireWithValues | undefined = desires?.find((desire: Desire) => desire.id === params.desireId)

  if (!desire) {
    // Handle the case where desire is undefined
    return null;
  }


  const desireValues: DesireValues['desireValues'] | undefined = desire.desireValues
  desireValues?.sort((a, b) => a.value.sortOrder - b.value.sortOrder)
  const { title, description, currentSituation, delta } = desire || {};

  const plural = desireValues && desireValues.length > 1 ? 's' : '';

  return (
    <>
      <section className='flex gap-8'>
        <div className=' flex-1 flex flex-col gap-6 min-w-[300px] max-w-max '>
          <div className=''>
            <BasicTextAreaBG >
              <div className='text-success mb-2'>
                <BreadCrumb14px text='Desire' />
              </div>
              <H1WithLink
                title={title}
                linkDestination={'editDetails'}
                linkText={'Edit Desire Details'}
              />

              <div className=" flex flex-wrap mt-2 max-w-prose text-info-content/70">
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

              <div className='mt-2'>
                <TextProseWidth
                  text={description}
                />
              </div>
            </BasicTextAreaBG >
          </div>

          <div className=''>
            <BasicTextAreaBG >
              <H2WithLink
                title={'Current Situation'}
                linkDestination={'editCurrent'}
                linkText={'Edit Current Situation'}
              />
              <div className='mt-2'>
                {currentSituation && (
                  <TextProseWidth
                    text={currentSituation}
                  />
                )}
              </div>
            </BasicTextAreaBG >
          </div>


          <div className=''>
            <BasicTextAreaBG >
              <H2WithLink
                title={'Difference to Create'}
                linkDestination={'editCurrent'}
                linkText={'Edit Current Situation'}
              />
              <div className='mt-2'>
                {delta && (
                  <TextProseWidth
                    text={delta}
                  />
                )}
              </div>
            </BasicTextAreaBG >
          </div>
        </div>

        <div className='flex-1  max-w-[800px]'>
          <Outlet />
        </div>
      </section >


    </>
  )
}

export default DesirePage
