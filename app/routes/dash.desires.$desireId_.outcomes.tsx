


import { Desire } from '@prisma/client';
import { useLoaderData, useMatches, useParams } from '@remix-run/react';
import { redirect, type ActionArgs, type LoaderArgs } from '@remix-run/server-runtime';
import DndPlus1200OutletFlex from '~/components/baseContainers/DndPlus1200OutletFlex';
import DndOutcomes from '~/components/dnds/outcomes/DndOutcomes';
import { getOutcomesByDesireId } from '~/models/outcome.server';

import type { DesireWithValues } from '~/types/desireTypes';
import type { OutcomeWithProgressList } from '~/types/outcomeTypes';

export const loader = async ({ request, params }: LoaderArgs) => {

  //load outcomes for this desire
  // const userId = await requireUserId(request)
  const desireId = params.desireId!

  try {
    const desireOutcomes : OutcomeWithProgressList[] = await getOutcomesByDesireId(desireId)
    return desireOutcomes
  } catch (error) { throw error }


}
export const action = async ({ request }: ActionArgs) => {
  // const formData = await request.formData()
  // const desireData = Object.fromEntries(formData);
  // const {desireId, outcomes} =  desireData as {desireId: string, outcomes: string[]}
  try {
    // await updateDesireSpecificOutcomes(desireId, currentSituation)
    return null
  } catch (error) { throw error }
}


function DesireSpecificOutcomesPage() {

  const desireOutcomes = useLoaderData()

  console.log('desireOutcomes', desireOutcomes)
  const params = useParams();
  const matches = useMatches();
  const desires: DesireWithValues[] = matches.find(match => match.id === 'routes/dash.desires')?.data.desires
  const desire: DesireWithValues | undefined = desires?.find((desire: Desire) => desire.id === params.desireId)

  const desireName = desire?.title
  // if (!desire) {
  //   return null;
  // }

  return (
    <>

      <DndPlus1200OutletFlex >
        <DndOutcomes 
        // setOrderBool={setOrderBool}  
        desireName={desireName}
        
        />
      </DndPlus1200OutletFlex>

    </>
  )
}

export default DesireSpecificOutcomesPage