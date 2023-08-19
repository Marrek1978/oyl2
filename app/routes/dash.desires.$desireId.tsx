import type { Desire } from '@prisma/client';
import { type LoaderArgs } from '@remix-run/server-runtime';
import { Outlet, useLoaderData, useMatches, useParams } from '@remix-run/react';

import DesireDisplay from '~/components/desires/DesireDisplay';
import { getOutcomesByDesireId } from '~/models/outcome.server';
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs';
import AllOutcomesDisplay from '~/components/desires/outcomes/AllOutcomesDisplay';
import AllMilestonesForDesire from '~/components/desires/outcomes/AllMilestonesForDesire';

import type { DesireValues, DesireWithValues } from '~/types/desireTypes';
import type { DesireOutcomeProgressWithStringDates, OutcomeWithProgessWithStringDates } from '~/types/outcomeTypes';


export const loader = async ({ request, params }: LoaderArgs) => {
  const desireId = params.desireId!
  try {
    const desireOutcomes = await getOutcomesByDesireId(desireId)
    return { desireOutcomes };
  } catch (error) { throw error }
}


function DesirePage() {

  const params = useParams();
  const matches = useMatches();
  const { desireOutcomes } = useLoaderData()

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
      <div className='flex flex-col max-w-max'>

        <div className='flex-1   w-full'>
          <DesireDisplay
            title={title || ''}
            description={description || ''}
            current={current || ''}
            ideal={ideal || ''}
            desireValues={desireValues}
            plural={plural}
          />
        </div>

        <div className='mt-8 w-full  '>
          <div className='flex gap-8 flex-wrap'>
            <div className='flex-1'>
              <AllOutcomesDisplay
                outcomes={outcomes}
                plural={plural}
                title={title || ''}
              />
            </div>
            <div className='flex-1'>
              <AllMilestonesForDesire
                outcomes={outcomes}
                title={title || ''}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DesirePage


