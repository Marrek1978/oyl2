import { useEffect, useState } from 'react';
import { useActionData, } from '@remix-run/react';
import { type ActionFunctionArgs, redirect } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal';
import useServerMessages from '~/components/modals/useServerMessages';
import DesiresCurrentForm from '~/components/forms/DesiresCurrentStateForm'
import { updateDesireCurrentSituation } from '~/models/desires.server';
import useNavigationState from '~/components/utilities/useNavigationState';
import { useGetSpecificDesireWithValuesAndOutcomes } from './dash.desires_.$desireId';

import type { Desire } from '@prisma/client';


export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const desireData = Object.fromEntries(formData);
  const { rowId, currentSituation } = desireData as { rowId: string, currentSituation: string }
  try {
    await updateDesireCurrentSituation(rowId, currentSituation)
    return redirect('..')
  } catch (error) { return 'failed' }
}


function EditDesireCurrentSituationPage() {
  const serverMessage = useActionData()
  const { navigationState } = useNavigationState()
  const loadedDesireWithValuesOutcomes = useGetSpecificDesireWithValuesAndOutcomes();

  const [isolatedDesire, setIsolatedDesire] = useState<Desire | undefined>()
  useServerMessages({ fetcherMessage: serverMessage, fetcherState: navigationState })

  useEffect(() => {
    if (!loadedDesireWithValuesOutcomes) return
    const { desireValues, outcomes, ...desire } = loadedDesireWithValuesOutcomes
    if (!desire) return
    setIsolatedDesire(desire)
  }, [loadedDesireWithValuesOutcomes])


  return (
    <>
      <Modal onClose={() => { }} zIndex={10}>
        <div className='formWidth'>
          <DesiresCurrentForm desire={isolatedDesire} />
        </div>
      </Modal>
    </>
  )
}

export default EditDesireCurrentSituationPage

