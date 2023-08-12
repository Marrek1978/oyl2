import { parse } from 'querystring';
import { useMatches, useParams } from '@remix-run/react';
import { type ActionArgs, type LoaderArgs } from '@remix-run/server-runtime';

import DndOutcomes from '~/components/dnds/outcomes/DndOutcomes';
import DndPlus1200OutletFlex from '~/components/baseContainers/DndPlus1200OutletFlex';
import { getOutcomesByDesireId, updateOutcomesOrder } from '~/models/outcome.server';

import type { Desire } from '@prisma/client';
import type { DesireWithValues } from '~/types/desireTypes';
import type { OutcomeWithProgressList } from '~/types/outcomeTypes';
import { DesireDescription } from './../components/utilities/Guidelines';

export const loader = async ({ request, params }: LoaderArgs) => {
  const desireId = params.desireId!
  try {
    const desireOutcomes: OutcomeWithProgressList[] = await getOutcomesByDesireId(desireId)
    return desireOutcomes
  } catch (error) { throw error }
}


export const action = async ({ request }: ActionArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const outcomes = JSON.parse(parsedBody.outcomesString as string);

  try {
    await updateOutcomesOrder(outcomes)
    console.log(' outcome order saved')
    return null
  } catch (error) { throw error }
}


function DesireSpecificOutcomesPage() {

  // const desireOutcomes = useLoaderData()

  const params = useParams();
  const matches = useMatches();
  const desires: DesireWithValues[] = matches.find(match => match.id === 'routes/dash.desires')?.data.desires
  const desire: DesireWithValues | undefined = desires?.find((desire: Desire) => desire.id === params.desireId)


  const desireName = desire?.title
  const DesireDescription = desire?.description
  // if (!desire) {
  //   return null;
  // }

  return (
    <>

      <DndPlus1200OutletFlex >
        <DndOutcomes
          // setOrderBool={setOrderBool}  
          desireName={desireName}
          description={DesireDescription}

        />
      </DndPlus1200OutletFlex>

    </>
  )
}

export default DesireSpecificOutcomesPage