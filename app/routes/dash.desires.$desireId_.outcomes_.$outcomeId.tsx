import { parse } from 'querystring'
import { useEffect, useState } from 'react'
import { useParams,  useNavigate } from '@remix-run/react'
import { redirect, type ActionArgs } from '@remix-run/server-runtime'

import { updateOutcome } from '~/models/outcome.server'

import type { Outcome } from '@prisma/client'
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
    await updateOutcome(outcomeData)
    return redirect('..')
  } catch (error) { throw error }
}


function EditOutcomePage() {

  // const desire: DesireWithValuesAndOutcomes | undefined = useGetDesireWithValuesAndOutcomes();
  // let outcome: DesireOutcome | undefined = useGetOutcome(desire)


  return (
    <>
      {/* <Outlet /> */}
      Outcome Id - basicall the old Project - outcome page to start 
      {/* <Modal onClose={() => { }} zIndex={10}>
        <DesiresOutcomesForm
          desire={desire}
          outcome={outcome}
          isNew={false}
        />
      </Modal> */}
    </>
  )
}

export default EditOutcomePage

export const useGetOutcome = (desire: DesireWithValuesAndOutcomes | undefined): Outcome | undefined => {

  const params = useParams();
  const navigate = useNavigate();
  const [outcome, setOutcome] = useState< Outcome | undefined>(undefined)

  useEffect(() => {
    const loadedOutcome:  Outcome | undefined= desire?.outcomes.find((outcome:  Outcome) => outcome.id === params.outcomeId)
    setOutcome(loadedOutcome)
  }, [ desire, params.outcomeId, navigate])

  console.log('returning outocme', outcome)
  return outcome
}