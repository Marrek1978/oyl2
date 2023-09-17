import { parse } from 'querystring';
import { type ActionArgs } from '@remix-run/server-runtime';

import { updateOutcomesOrder } from '~/models/outcome.server';
import DndOutcomes from '~/components/dnds/outcomes/DndOutcomes';
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs';

import DndPlus800OutletFlex from '~/components/baseContainers/DndPlus800OutletFlex';


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

  return (
    <>
      <BreadCrumbs secondCrumb={'Desire'} />
      <DndPlus800OutletFlex >
        <DndOutcomes />
      </DndPlus800OutletFlex>
    </>
  )
}

export default DesireSpecificOutcomesPage