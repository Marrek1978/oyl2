import { type ActionArgs, redirect } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal';
import { useGetDesireWithValuesAndOutcomes } from './dash.desires';
import DesiresIdealForm from '~/components/forms/DesiresIdealForm';
import { updateDesireIdealScenario } from '~/models/desires.server';



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
  const desire = useGetDesireWithValuesAndOutcomes();

  return (
    <>
      <Modal onClose={() => { }} zIndex={10}>
        <DesiresIdealForm desire={desire} />
      </Modal>
    </>
  )
}

export default EditDesireIdealScenarioPage