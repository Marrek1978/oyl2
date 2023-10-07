import { useEffect, useState } from 'react'
import { Outlet, useParams } from '@remix-run/react'
import { redirect, type ActionArgs } from '@remix-run/server-runtime'

import Modal from '~/components/modals/Modal'
import { updateValue } from '~/models/values.server'
import ValueForm from '~/components/forms/ValueForm'
import { useGetArrayLength, useGetSpecificValue } from './dash.values'
import useInvalidItemIdAlertAndRedirect from '~/components/modals/InvalidItemIdAlertAndRedirect'

import type { Value } from '@prisma/client';


export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const valueData = Object.fromEntries(formData);

  let value = {
    id: valueData.rowId as string,
    title: valueData.title as string,
    description: valueData.description as string,
  }
  try {
    await updateValue(value)
    return redirect('..')
  } catch (error) { throw error }
}


function EditValueRoute() {

  const params = useParams();
  const [specificValue, setSpecificValue] = useState<Value>()

  const id = params.valueId
  const { value } = useGetSpecificValue(id as string)
  const nextSortOrder = useGetArrayLength()
  const { warning, alertMessage } = useInvalidItemIdAlertAndRedirect(value)


  useEffect(() => {
    if (!value) return
    setSpecificValue(value)
  }, [value,])

  return (
    <>
      <Outlet />
      {warning && (
        <Modal zIndex={50}>
          {alertMessage}
        </Modal>
      )}

      <Modal onClose={() => { }} zIndex={10}>
        <ValueForm
          value={specificValue}
          isNew={false}
          nextSortOrder={nextSortOrder}
        />
      </Modal>
    </>
  )
}

export default EditValueRoute