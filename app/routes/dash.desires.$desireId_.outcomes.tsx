

import DndPlusOutletFlex from '~/components/baseContainers/DndPlusOutletFlex';

import type { ActionArgs, LoaderArgs } from '@remix-run/server-runtime';

export const loader = async ({ request, params }: LoaderArgs) => {
  return null
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


function EditDesireSpecificOutcomesPage() {
  // const params = useParams();
  // const matches = useMatches();
  // const desires: DesireWithValues[] = matches.find(match => match.id === 'routes/dash.desires')?.data.desires
  // const desire: DesireWithValues | undefined = desires?.find((desire: Desire) => desire.id === params.desireId)

  // if (!desire) {
  //   return null;
  // }

  return (
    <>

      <DndPlusOutletFlex >
        <div>DND of Outcomes</div>
      </DndPlusOutletFlex>

    </>
  )
}

export default EditDesireSpecificOutcomesPage