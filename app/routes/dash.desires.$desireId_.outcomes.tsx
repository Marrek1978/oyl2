import { parse } from 'querystring';
import { useMatches, useParams } from '@remix-run/react';
import { type ActionArgs, type LoaderArgs } from '@remix-run/server-runtime';

import DndOutcomes from '~/components/dnds/outcomes/DndOutcomes';
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs';
import { getOutcomesByDesireId, updateOutcomesOrder } from '~/models/outcome.server';

import type { Desire, DesireOutcome } from '@prisma/client';
import type { DesireWithValues } from '~/types/desireTypes';
import DndPlus800OutletFlex from '~/components/baseContainers/DndPlus800OutletFlex';

export const loader = async ({ request, params }: LoaderArgs) => {
  const desireId = params.desireId!
  try {
    const desireOutcomes: DesireOutcome[] = await getOutcomesByDesireId(desireId)
    return desireOutcomes
  } catch (error) { throw error }
}


export const action = async ({ request }: ActionArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const outcomes = JSON.parse(parsedBody.outcomesString as string);

  try {
    await updateOutcomesOrder(outcomes)
    return 'Outcomes order was updated'
  } catch (error) {
    return 'There was an issue updating the sorting order'
  }
}


function DesireSpecificOutcomesPage() {

  // const desireOutcomes = useLoaderData()

  const params = useParams();
  const matches = useMatches();
  const desires: DesireWithValues[] = matches.find(match => match.id === 'routes/dash.desires')?.data.desires
  const desire: DesireWithValues | undefined = desires?.find((desire: Desire) => desire.id === params.desireId)

  const desireName = desire?.title
  const DesireDescription = desire?.description
  console.log('desireName is ', desireName)

  return (
    <>
      <BreadCrumbs secondCrumb={'Desire'} />
      <DndPlus800OutletFlex >
        <DndOutcomes
          desireName={desireName}
          description={DesireDescription}
        />
      </DndPlus800OutletFlex>
    </>
  )
}

export default DesireSpecificOutcomesPage