import {  useEffect, useState } from 'react';
import { useParams, } from '@remix-run/react';
import type { ActionFunctionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import { deletePayment } from '~/models/payment.server';
import { setAsCurrency } from '~/components/forms/savings/SavingForm';
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal';
import useFormDeletedToastAndRedirect from '~/components/utilities/useFormDeletedToast';
import { useGetPayment } from './dash.desires_.$desireId_.outcomes_.$outcomeId_.savings_.$savingId.$paymentId';


export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const paymentData = Object.fromEntries(formData);
  const id = paymentData.rowId as string
  try {
    await deletePayment(id)
    return 'deleted'
  } catch (error) { return 'failed' }
}


function DeletePaymentPage() {
  const params = useParams();
  const [title, setTitle] = useState<string>('')

  const paymentId = params.paymentId as string
  const payment = useGetPayment()

  useEffect(() => {
    if (!payment) return
    const date = new Date(payment.paymentDate)
    const amt = setAsCurrency(payment.amount.toString())
    const titleString = `on ${date.toDateString()} of ${amt}`
    setTitle(titleString)
  }, [payment])

  useFormDeletedToastAndRedirect({ redirectTo: '../../', message: 'Payment was deleted' })

  return (
    <>
      <Modal onClose={() => { }} zIndex={30}>
        < AreYouSureDeleteModal
          item={'Payment'}
          title={title}
          id={paymentId}
        />
      </Modal>
    </>
  )
}

export default DeletePaymentPage