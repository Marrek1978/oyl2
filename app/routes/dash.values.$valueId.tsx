import { Outlet, useMatches, useParams } from '@remix-run/react'
import { redirect, type ActionArgs } from '@remix-run/server-runtime'

import Modal from '~/components/modals/Modal'
import { updateValue } from '~/models/values.server'
import ValueForm from '~/components/forms/ValueForm'

import type { Value } from '@prisma/client';
import type { validationErrorsTypes } from '~/types/valueTypes'


export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const valueData = Object.fromEntries(formData);

  let validationErrors: validationErrorsTypes = {};
  !valueData.title && (validationErrors.title = 'A title is required')
  !valueData.description && (validationErrors.description = 'A description is required')
  if (!valueData.title || !valueData.description) return validationErrors

  let value = {
    valueId: valueData.valueId as string,
    valueTitle: valueData.title as string,
    valueDescription: valueData.description as string,
  }

  try {
    await updateValue(value)
    return redirect('/dash/values')
  } catch (error) { throw error }
}


function EditValueRoute() {

  const matches = useMatches();
  const params = useParams();
  const values = matches.find(match => match.id === 'routes/dash.values')?.data
  const value = values?.find((value: Value) => value.id === params.valueId)

  return (
    <>
      <Outlet />
      <Modal onClose={() => { }} zIndex={10}>
        <ValueForm
          value={value}
          isNew={false}
        />
      </Modal>
    </>
  )
}

export default EditValueRoute