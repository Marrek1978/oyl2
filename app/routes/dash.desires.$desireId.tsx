import type { Desire, DesireOutcome } from '@prisma/client';
import { type LoaderArgs } from '@remix-run/server-runtime';
import { Outlet, useLoaderData, useMatches, useParams } from '@remix-run/react';

import DesireDisplay from '~/components/desires/DesireDisplay';
import { getOutcomesByDesireId } from '~/models/outcome.server';
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs';
import AllOutcomesDisplay from '~/components/desires/outcomes/AllOutcomesDisplay';

import type { DesireValues, DesireWithValues } from '~/types/desireTypes';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';
import H2WithLinkAndProsePara from '~/components/text/H2WithLinkAndProsePara';
import { DesireIdealPlaceholderText } from '~/components/utilities/PlaceHolderTexts';

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

  const desires: DesireWithValues[] = matches.find(match => match.id === 'routes/dash.desires')?.data.desiresWithValues
  const desire: DesireWithValues | undefined = desires.find((desire: Desire) => desire.id === params.desireId)

  const desireValues: DesireValues['desireValues'] = desire?.desireValues || []
  desireValues?.sort((a, b) => a.value.sortOrder - b.value.sortOrder)
  const { title, description, current, ideal } = desire || {};
  const plural = desireValues && desireValues.length > 1 ? 's' : '';

  const outcomes = desireOutcomes?.map((outcome: DesireOutcome) => {
    return {
      ...outcome,
      createdAt: new Date(outcome.createdAt),
      updatedAt: new Date(outcome.updatedAt),
    }
  })


  return (
    <>

      <BreadCrumbs title={title || ''} />
      <Outlet />

      <BasicTextAreaBG >
        <div className='flex flex-col max-w-max'>

          <section id='desireAndCurrentSituation'>
            <div className='flex-1 w-full'>
              <DesireDisplay
                title={title || ''}
                description={description || ''}
                current={current || ''}
                ideal={ideal || ''}
                desireValues={desireValues}
                plural={plural}
              />
            </div>
          </section>


          <section id='IdealAndOutcomes'>

            <div className='flex gap-8 flex-wrap'>
              <div className='flex-1'>
                {/* //?  THE IDEAL SITUATION  */}
                <div className='flex-1 min-w-[400px]'>
                  <H2WithLinkAndProsePara
                    title={'The Ideal Scenario'}
                    linkDestination={'editIdeal'}
                    linkText={'Edit Ideal Scenario'}
                    paragraph={ideal?.length ? ideal : DesireIdealPlaceholderText}
                  />
                </div>
              </div>
              <div className='flex-1'>
                <AllOutcomesDisplay
                  outcomes={outcomes}
                  plural={plural}
                  title={title || ''}
                />
              </div>

            </div>
          </section>
        </div>
      </BasicTextAreaBG >

    </>
  )
}

export default DesirePage


