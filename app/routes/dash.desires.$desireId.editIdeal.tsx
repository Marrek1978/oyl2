import { useMatches, useParams } from '@remix-run/react';

import DesiresIdealForm from '~/components/forms/DesiresIdealForm';
import { updateDesireIdealScenario } from '~/models/desires.server';

import type { DesireWithValues } from '~/types/desireTypes';
import type { Desire } from '@prisma/client';
import { type ActionArgs, redirect } from '@remix-run/server-runtime';
import Modal from '~/components/modals/Modal';


export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const desireData = Object.fromEntries(formData);
  const { desireId, ideal } = desireData as { desireId: string, ideal: string }
  try {
    await updateDesireIdealScenario(desireId, ideal)
    return redirect(`/dash/desires/${desireId}`)

  } catch (error) { throw error }
}



function EditDesireIdealScenarioPage() {
  const params = useParams();
  const matches = useMatches();
  const desires: DesireWithValues[] = matches.find(match => match.id === 'routes/dash.desires')?.data.desires
  const desire: DesireWithValues | undefined = desires?.find((desire: Desire) => desire.id === params.desireId)

  if (!desire) {
    redirect('/dash/desires');
    return null;
  }

  return (
    <>
      <Modal onClose={() => { }} zIndex={10}>
        <DesiresIdealForm desire={desire} />
      </Modal>
    </>
  )
}

export default EditDesireIdealScenarioPage