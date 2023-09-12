import { redirect, type ActionArgs } from '@remix-run/server-runtime'

import { createValue } from '~/models/values.server'
import ValueForm from '~/components/forms/ValueForm'
import { requireUserId } from '~/models/session.server'

import type { validationErrorsTypes } from '~/types/validationTypes'


// export const loader = async ({ request }: LoaderArgs) => {
  // try {
  //   const userId = await requireUserId(request);
  //   return userId
  // } catch (error) { throw error }
// }

export const action = async ({ request }: ActionArgs) => {

  const userId = await requireUserId(request)
  const formData = await request.formData()
  const valueData = Object.fromEntries(formData);

  //! do clentside validation to stop rerenders
  let validationErrors: validationErrorsTypes = {};
  !valueData.title && (validationErrors.title = 'A title is required')
  !valueData.description && (validationErrors.description = 'A description is required')
  if (!valueData.title || !valueData.description) return validationErrors

  let value = {
    valueTitle: valueData.title as string,
    valueDescription: valueData.description as string,
    userId,
    sortOrder: valueData.sortOrder ? parseInt(valueData.sortOrder as string) : 0,
  }

  try {
    await createValue(value)
    return redirect('/dash/values')
  } catch (error) { throw error }
}

function AddNewValuePage() {
  return (
    <>
      <ValueForm
      isNew={true}
       />
    </>
  )
}

export default AddNewValuePage

