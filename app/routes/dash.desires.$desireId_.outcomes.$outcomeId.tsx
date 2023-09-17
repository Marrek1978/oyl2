import { parse } from 'querystring'
import { useEffect, useState } from 'react'
import { useParams, Outlet, useNavigate } from '@remix-run/react'
import { redirect, type ActionArgs } from '@remix-run/server-runtime'

import Modal from '~/components/modals/Modal'
import { updateDesireOutcome } from '~/models/outcome.server'
import { useGetDesireWithValuesAndOutcomes } from './dash.desires'
import DesiresOutcomesForm from '~/components/forms/DesiresOutcomesForm'

import type { DesireOutcome } from '@prisma/client'
import type { DesireWithValuesAndOutcomes, validationErrorsTypes } from '~/types/desireTypes'


export const action = async ({ request }: ActionArgs) => {
  const formBody = await request.text();
  const outcomeData = JSON.parse(parse(formBody).outcomeString as string);

  let validationErrors: validationErrorsTypes = {};
  !outcomeData.title && (validationErrors.title = 'A title is required')
  !outcomeData.description && (validationErrors.description = 'A description is required')
  console.log(validationErrors)
  if (!outcomeData.title || !outcomeData.description) return validationErrors

  try {
    await updateDesireOutcome(outcomeData)
    return redirect('..')
  } catch (error) { throw error }
}


function EditOutcomePage() {

  const desire: DesireWithValuesAndOutcomes | undefined = useGetDesireWithValuesAndOutcomes();
  let outcome: DesireOutcome | undefined = useGetOutcome(desire)


  return (
    <>
      <Outlet />
      <Modal onClose={() => { }} zIndex={10}>
        <DesiresOutcomesForm
          desire={desire}
          outcome={outcome}
          isNew={false}
        />
      </Modal>
    </>
  )
}

export default EditOutcomePage

export const useGetOutcome = (desire: DesireWithValuesAndOutcomes | undefined): DesireOutcome | undefined => {

  const params = useParams();
  const navigate = useNavigate();
  const [outcome, setOutcome] = useState<DesireOutcome | undefined>(undefined)

  useEffect(() => {
    console.log(' in useGetOutcome useEffect')
    const loadedOutcome: DesireOutcome | undefined= desire?.desireOutcomes.find((outcome: DesireOutcome) => outcome.id === params.outcomeId)
    
    // console.log(' loadedOutcome is', loadedOutcome)
    // if (!loadedOutcome) {
    //   // navigate('/dash/desires');
    //   return
    // }
    
    console.log('setting outcome')
    setOutcome(loadedOutcome)
  }, [ desire, params.outcomeId, navigate])

  console.log('returning outocme', outcome)
  return outcome
}