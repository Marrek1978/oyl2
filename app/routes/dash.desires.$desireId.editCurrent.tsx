import { redirect, type ActionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal';
import { useGetDesireWithValuesAndOutcomes } from './dash.desires';
import DesiresCurrentForm from '~/components/forms/DesiresCurrentForm'
import { updateDesireCurrentSituation } from '~/models/desires.server';



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

  const desire = useGetDesireWithValuesAndOutcomes();

  return (
    <>
      <Modal onClose={() => { }} zIndex={10}>
        <DesiresCurrentForm desire={desire} />
      </Modal>
    </>
  )
}

export default EditDesireCurrentSituationPage