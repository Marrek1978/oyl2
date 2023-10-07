import { useActionData } from '@remix-run/react';
import { type ActionArgs, redirect } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal';
import DesiresIdealForm from '~/components/forms/DesiresIdealForm';
import { updateDesireIdealScenario } from '~/models/desires.server';
import useServerMessages from '~/components/modals/useServerMessages';
import useNavigationState from '~/components/utilities/useNavigationState';
import { useGetSpecificDesireWithValuesAndOutcomes } from './dash.desires_.$desireId';



export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const desireData = Object.fromEntries(formData);
  const { rowId, ideal } = desireData as { rowId: string, ideal: string }
  try {
    await updateDesireIdealScenario(rowId, ideal)
    return redirect('..')
  
  } catch (error) { return 'failed' }
}



function EditDesireIdealScenarioPage() {
  const desire = useGetSpecificDesireWithValuesAndOutcomes();
  
  const serverMessage = useActionData()
  const { navigationState } = useNavigationState()
  useServerMessages({ fetcherMessage: serverMessage, fetcherState: navigationState })

  return (
    <>
      <Modal onClose={() => { }} zIndex={10}>
        <DesiresIdealForm desire={desire} />
      </Modal>
    </>
  )
}

export default EditDesireIdealScenarioPage