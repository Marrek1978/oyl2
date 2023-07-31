import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import { Link, useLoaderData } from '@remix-run/react';

import { getDesireById } from '~/models/desires.server'
import { requireUserId } from '~/models/session.server';
import TextBtn from '~/components/buttons/TextBtn';
import HeadingH1 from '~/components/titles/HeadingH1';
import { EditIcon } from '~/components/utilities/icons';
import SubHeading14px from '~/components/titles/SubHeading14px';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';

import type { LoaderArgs } from '@remix-run/server-runtime'
import type { DesireWithValues } from '~/types/desireTypes';
import HeadingH2 from '~/components/titles/HeadingH2';

export const loader = async ({ request, params }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const desireId = params.desireId!
  const desire: DesireWithValues | null = await getDesireById(desireId, userId)
  if (desire === null) {
    throw { error: 'Desire not found' };
  }
  return { desire };

}

// type DesireData = DesireWithStringDates | DesireWithValues;


function DesirePage() {

  let { desire } = useLoaderData<typeof loader>();

  const desireValues = desire?.desireValues
  desireValues?.sort((a, b) => a.value.sortOrder - b.value.sortOrder)
  const { title, id, description } = desire

  const plural = desireValues && desireValues.length > 1 ? 's' : '';

  return (
    <>
      <div className='max-w-max mb-8'>
        <BasicTextAreaBG >
          <div className='text-success mb-2'>
            <SubHeading14px text='Desire' />
          </div>
          <div className="flex justify-between items-baseline gap-4">
            <HeadingH1 text={title} />
            <Link to={id} className='text-sm'>
              <TextBtn
                text='Edit Description'
                onClickFunction={() => { }}
                icon={EditIcon}
              />
            </Link>
          </div>


          <div className=" flex flex-wrap mt-2 max-w-prose text-info-content/70">
            <SubHeading14px
              text={`Aligned with the Value${plural} of : `}
            />
            {desireValues?.map((value) => {
              const title = value.value.valueTitle
              let id = uuidv4();
              return (
                <div key={id}
                  className={`
                font-medium 
                `} >
                  <SubHeading14px text={`${title}, `} />
                </div>
              )
            })
            }
          </div >

          <div className='
          text-base-content/70
          mt-2      
          max-w-prose w-prose
          '>
            {description}
          </div>
        </BasicTextAreaBG >
      </div>



      <div className='max-w-max'>
        <BasicTextAreaBG >
          <div className="flex justify-between items-baseline gap-4">
            <HeadingH2 text={'Current Situation'} />
            <Link to={id} className='text-sm'>
              <TextBtn
                text='Edit Current Situation'
                onClickFunction={() => { }}
                icon={EditIcon}
              />
            </Link>
          </div>
          <div className='
          text-base-content/70
          mt-2      
          max-w-prose w-prose
          '>
            {description}
          </div>
        </BasicTextAreaBG >
      </div>


      <div className='max-w-max'>
        <BasicTextAreaBG >
          <div className="flex justify-between items-baseline gap-4">
            <HeadingH2 text={'Difference to Create'} />
            <Link to={id} className='text-sm'>
              <TextBtn
                text='Edit Current Situation'
                onClickFunction={() => { }}
                icon={EditIcon}
              />
            </Link>
          </div>
          <div className='
          text-base-content/70
          mt-2      
          max-w-prose w-prose
          '>
            {description}
          </div>
        </BasicTextAreaBG >
      </div>





    </>
  )
}

export default DesirePage
