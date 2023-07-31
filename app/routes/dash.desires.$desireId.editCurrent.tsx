import { useMatches, useParams } from '@remix-run/react';

import DesiresCurrentForm from '~/components/forms/DesiresCurrentForm'
import { updateDesireCurrentSituation } from '~/models/desires.server';

import type { Desire } from '@prisma/client';
import type { DesireWithValues } from '~/types/desireTypes';
import type { ActionArgs } from '@remix-run/server-runtime';

export const action = async ({request} : ActionArgs) => {
  const formData = await request.formData()
  const desireData = Object.fromEntries(formData);
  const {desireId, currentSituation} =  desireData as {desireId: string, currentSituation: string}
  try {
    await updateDesireCurrentSituation(desireId, currentSituation)
    return null
  } catch (error) { throw error }
}


function EditDesireCurrentSituation() {

  const matches = useMatches();
  const params = useParams();
  const desires: DesireWithValues[] = matches.find(match => match.id === 'routes/dash.desires')?.data.desires
  const desire: DesireWithValues | undefined = desires?.find((desire: Desire) => desire.id === params.desireId)

  if (!desire) {
    return null;
  }

  return (
    <>
      <DesiresCurrentForm desire={desire} />
    </>
  )
}

export default EditDesireCurrentSituation