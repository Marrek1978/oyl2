import { useMatches, useParams } from '@remix-run/react';

import DesiresCurrentForm from '~/components/forms/DesiresCurrentForm'
import { updateDesireCurrentSituation } from '~/models/desires.server';

import type { Desire } from '@prisma/client';
import type { DesireWithValues } from '~/types/desireTypes';
import { redirect, type ActionArgs } from '@remix-run/server-runtime';
import Modal from '~/components/modals/Modal';

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const desireData = Object.fromEntries(formData);
  const { desireId, currentSituation } = desireData as { desireId: string, currentSituation: string }
  try {
    await updateDesireCurrentSituation(desireId, currentSituation)
    return redirect(`/dash/desires/${desireId}`)
  } catch (error) { throw error }
}


function EditDesireCurrentSituationPage() {

  const params = useParams();
  const matches = useMatches();
  const desires: DesireWithValues[] = matches.find(match => match.id === 'routes/dash.desires')?.data.desires
  const desire: DesireWithValues | undefined = desires?.find((desire: Desire) => desire.id === params.desireId)

  if (!desire) {
    return null;
  }

  return (
    <>
      <Modal onClose={() => { }} zIndex={10}>
        <DesiresCurrentForm desire={desire} />
      </Modal>
    </>
  )
}

export default EditDesireCurrentSituationPage