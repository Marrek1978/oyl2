import { parse } from 'querystring';

import { requireUserId } from '~/models/session.server';
import { createOutcome } from '~/models/outcome.server';
import { useGetDesireWithValuesAndOutcomes } from './dash.desires';
import DesiresOutcomesForm from '~/components/forms/DesiresOutcomesForm'

import type { ActionArgs } from '@remix-run/server-runtime';
import type { DesireWithValuesAndOutcomes } from '~/types/desireTypes';


export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request)
  const formBody = await request.text();
  const outcomeData = JSON.parse(parse(formBody).outcomeString as string);

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
    console.log('outcome', outcome)
    await createOutcome(outcome)
    return null
  } catch (error) { throw error }
}


function DesireOutcomesIndexPage() {
  const desire: DesireWithValuesAndOutcomes | undefined = useGetDesireWithValuesAndOutcomes();

  return (
    <>
      <DesiresOutcomesForm desire={desire} />
    </>
  )
}

export default DesireOutcomesIndexPage