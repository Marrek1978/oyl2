import { useEffect, useState } from 'react';
import { useActionData } from '@remix-run/react';
import { type ActionFunctionArgs, redirect } from '@remix-run/server-runtime';

import Modal from '~/components/displays/modals/Modal';
import DesiresIdealForm from '~/components/forms/DesiresIdealForm';
import { updateDesireIdealScenario } from '~/models/desires.server';
import useServerMessages, { FetcherMessageType } from '~/components/displays/modals/useServerMessages';
import useNavigationState from '~/components/utilities/useNavigationState';
import { useGetSpecificDesireWithValuesAndOutcomes } from './dash.desires_.$desireId';

import type { DesireWithValuesAndOutcomes } from '~/types/desireTypes';



export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const desireData = Object.fromEntries(formData);
  const { rowId, ideal } = desireData as { rowId: string, ideal: string }
  try {
    await updateDesireIdealScenario(rowId, ideal)
    return redirect('..')

  } catch (error) { return 'failed' }
}



function EditDesireIdealScenarioPage() {

  const serverMessage = useActionData() as FetcherMessageType
  const { navigationState } = useNavigationState()
  const loadedDesire = useGetSpecificDesireWithValuesAndOutcomes();
  const [desire, setDesire] = useState<DesireWithValuesAndOutcomes>()

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

