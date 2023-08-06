import { useMatches, useParams } from '@remix-run/react';

import DesiresOutcomesForm from '~/components/forms/DesiresOutcomesForm'

import type { Desire } from '@prisma/client';
import type { DesireWithValues, validationErrorsTypes } from '~/types/desireTypes';
import type { ActionArgs } from '@remix-run/server-runtime';
import { requireUserId } from '~/models/session.server';
import { parse } from 'querystring';
import { createDesireOutcomeAndProgressList } from '~/models/outcome.server';
import { NewlyCreatedProgress } from '~/types/progressTypes';

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request)
  const formBody = await request.text();
  const outcomeData = JSON.parse(parse(formBody).outcomeString as string);

  let validationErrors: validationErrorsTypes = {};
  !outcomeData.title && (validationErrors.title = 'A title is required')
  if (!outcomeData.title) return validationErrors

  const progressList = outcomeData.progressList as NewlyCreatedProgress[]

  let outcome = {
    userId,
    title: outcomeData.title as string,
    description: outcomeData.description as string,
    sortOrder: outcomeData.sortOrder ? parseInt(outcomeData.sortOrder as string) : 0,
    dueDate: outcomeData.dueDate ? new Date(outcomeData.dueDate as string) : null,
    complete: false,
    desireId: outcomeData.desireId as string,
    progressList: progressList,
  }

  try {
    await createDesireOutcomeAndProgressList(outcome)
    // return redirect('/dash/desires')
    return null
  } catch (error) { throw error }
}


function DesireOutcomesIndexPage() {
  const params = useParams();
  const matches = useMatches();
  const desires: DesireWithValues[] = matches.find(match => match.id === 'routes/dash.desires')?.data.desires
  const desire: DesireWithValues | undefined = desires?.find((desire: Desire) => desire.id === params.desireId)



  return (
    <>
      <DesiresOutcomesForm desire={desire} />
    </>
  )
}

export default DesireOutcomesIndexPage