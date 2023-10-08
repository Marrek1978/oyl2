import { parse } from 'querystring';
import { useEffect, useState } from 'react';
import type { ActionArgs, LoaderArgs } from '@remix-run/server-runtime';

import DndOutcomes from '~/components/dnds/outcomes/DndOutcomes';
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs';
import DndAndFormFlex from '~/components/baseContainers/DndAndFormFlex';
import { getDesireWithValuesAndOutcomes } from '~/models/desires.server';
import { createOutcome, updateOutcomesOrder } from '~/models/outcome.server';
import { useGetSpecificDesireWithValuesAndOutcomes } from './dash.desires_.$desireId';

import { requireUserId } from '~/models/session.server';
import OutcomesForm from '~/components/forms/OutcomesForm';

import type { Desire, Outcome } from '@prisma/client';
import { Outlet } from '@remix-run/react';

export const loader = async ({ request, params }: LoaderArgs) => {
  const { desireId } = params
  if (!desireId) throw new Error('No desireId in params')
  try {
    const desiresWithValuesOutcomes = await getDesireWithValuesAndOutcomes(desireId);
    return desiresWithValuesOutcomes
  } catch (error) { throw error }
};



export const action = async ({ request }: ActionArgs) => {

  if (request.method === 'PUT') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const outcomesObj = JSON.parse(parsedBody.toServerDataString as string);
    const outcomes = outcomesObj.sortableArray
    try {
      await updateOutcomesOrder(outcomes)
      return 'success'
    } catch (error) { return 'failed' }
  }

  if (request.method === 'POST') {
    const userId = await requireUserId(request)
    const formData = await request.formData()
    const outcomeData = Object.fromEntries(formData);

    let outcome = {
      userId,
      title: outcomeData.title as string,
      description: outcomeData.description as string,
      vision: outcomeData.vision as string,
      sortOrder: outcomeData.sortOrder ? parseInt(outcomeData.sortOrder as string) : 0,
      dueDate: outcomeData.dueDate ? new Date(outcomeData.dueDate as string) : null,
      complete: false,
      desireId: outcomeData.desireId as string,
    }

    try {
      await createOutcome(outcome)
      return 'success'
    } catch (error) { return 'failed' }
  }
}


function DesireSpecificOutcomesPage() {

  const [desire, setDesire] = useState<Desire>();
  const [outcomesState, setOutcomesState] = useState<Outcome[]>([])
  const desiresIdLoaderData = useGetSpecificDesireWithValuesAndOutcomes({ path: `routes/dash.desires_.$desireId_.outcomes` })

  useEffect(() => {
    if (!desiresIdLoaderData) return
    const { outcomes, desireValues, ...loadedDesire } = desiresIdLoaderData
    setDesire(loadedDesire)
    if (outcomes) setOutcomesState(outcomes)
  }, [desiresIdLoaderData])


  return (
    <>
    <Outlet />
      <BreadCrumbs secondCrumb={'Desire'} />
      <DndAndFormFlex
        dnd={<DndOutcomes passedOutcomes={outcomesState} />}
        form={
          <OutcomesForm
            desire={desire}
            nextSortOrder={outcomesState.length}
          />
        }
      />
    </>
  )
}

export default DesireSpecificOutcomesPage