import { useActionData } from '@remix-run/react';
import { type ActionArgs, redirect } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal';
import DesiresIdealForm from '~/components/forms/DesiresIdealForm';
import { updateDesireIdealScenario } from '~/models/desires.server';
import useServerMessages from '~/components/modals/useServerMessages';
import useNavigationState from '~/components/utilities/useNavigationState';
import { useGetSpecificDesireWithValuesAndOutcomes } from './dash.desires_.$desireId';
import { useEffect, useState } from 'react';
import { DesireWithValuesAndOutcomes } from '~/types/desireTypes';



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
  
  const serverMessage = useActionData()
  const [desire, setDesire] = useState<DesireWithValuesAndOutcomes>()
  const { navigationState } = useNavigationState()
  const loadedDesire = useGetSpecificDesireWithValuesAndOutcomes();

useEffect(() => {
  if (!loadedDesire) return
  setDesire(loadedDesire)
}, [loadedDesire])

  useServerMessages({ fetcherMessage: serverMessage, fetcherState: navigationState })

  return (
    <>
      <Modal onClose={() => { }} zIndex={10}>
        <div className='formWidth'>
          <DesiresIdealForm desire={desire} />
        </div>
      </Modal>
    </>
  )
}

export default EditDesireIdealScenarioPage

function DesireWithValuesAndOutcomes() {
  throw new Error('Function not implemented.');
}
