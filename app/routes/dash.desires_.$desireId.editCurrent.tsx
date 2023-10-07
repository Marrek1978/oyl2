import { useActionData, } from '@remix-run/react';
import { type ActionArgs, redirect } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal';
import useServerMessages from '~/components/modals/useServerMessages';
import DesiresCurrentForm from '~/components/forms/DesiresCurrentForm'
import { updateDesireCurrentSituation } from '~/models/desires.server';
import useNavigationState from '~/components/utilities/useNavigationState';
import { useGetSpecificDesireWithValuesAndOutcomes } from './dash.desires_.$desireId';


export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const desireData = Object.fromEntries(formData);
  const { rowId, currentSituation } = desireData as { rowId: string, currentSituation: string }
  try {
    await updateDesireCurrentSituation(rowId, currentSituation)
    return redirect('..')
  } catch (error) { return 'failed' }
}


function EditDesireCurrentSituationPage() {
  const desire = useGetSpecificDesireWithValuesAndOutcomes();
  const serverMessage = useActionData()

  const { navigationState } = useNavigationState()
  useServerMessages({ fetcherMessage: serverMessage, fetcherState: navigationState })

  return (
    <>
      <Modal onClose={() => { }} zIndex={10}>
        <DesiresCurrentForm desire={desire} />
      </Modal>
    </>
  )
}

export default EditDesireCurrentSituationPage

 