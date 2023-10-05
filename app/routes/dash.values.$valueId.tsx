import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from '@remix-run/react'
import { redirect, type ActionArgs } from '@remix-run/server-runtime'

import Modal from '~/components/modals/Modal'
import { useGetSpecificValue } from './dash.values'
import { updateValue } from '~/models/values.server'
import ValueForm from '~/components/forms/ValueForm'


import type { Value } from '@prisma/client';
import useInvalidItemIdAlertAndRedirect from '~/components/modals/InvalidItemIdAlertAndRedirect'


export const action = async ({ request }: ActionArgs) => {
  console.log('edit action')
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
  const navigate = useNavigate()
  const [specificValue, setSpecificValue] = useState<Value>()
  const [valuesArrLength, setValuesArrLength] = useState<number>(0)

  const id = params.valueId
  if (!id || id === undefined) navigate('..')
  const { value, values } = useGetSpecificValue(id as string)
  const { warning, alertMessage } = useInvalidItemIdAlertAndRedirect(value)



  useEffect(() => {
    if (!values) return
    setValuesArrLength(values.length)
    if (!value) return
    setSpecificValue(value)
  }, [value, values])

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
          valuesArrayLength={valuesArrLength}
        />
      </Modal>
    </>
  )
}

export default EditValueRoute