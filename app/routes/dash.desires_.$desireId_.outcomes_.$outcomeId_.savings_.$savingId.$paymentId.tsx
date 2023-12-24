import { parse } from 'querystring';
import { Outlet, useParams } from '@remix-run/react';
import type { ActionFunctionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import { updatePayment } from '~/models/payment.server';
import PaymentForm from '~/components/forms/savings/PaymentForm'
import { currStringToNum } from '~/routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.savings';
import { useGetSaving } from './dash.desires_.$desireId_.outcomes_.$outcomeId_.savings_.$savingId';

import type { Payments } from '@prisma/client';
import type { UpdatePayment } from '~/types/paymentTypes';


export const action = async ({ request }: ActionFunctionArgs) => {

  const formData = await request.text()
  const parsedData = parse(formData)
  const parsedPaymentString = JSON.parse(parsedData?.paymentString as string)
  const id = parsedPaymentString.paymentId
  const payment: UpdatePayment = {
    amount: currStringToNum(parsedPaymentString?.amount),
    paymentDate: new Date(parsedPaymentString?.paymentDate?.toString() || new Date()),
  }

  try {
    await updatePayment(id, payment)
    return "success"
  } catch (error) {
    return 'failure'
  }
}

function EditPaymentPage() {

  const payment = useGetPayment()
  const params = useParams();
  const { savingsId } = params;


  return (
    <>
      <Outlet />
      <Modal onClose={() => { }} zIndex={10}>
        <div className='max-w-md'>
          <PaymentForm passedSavingsId={savingsId || ' '} passedPayment={payment} isNew={false} />
        </div>
      </Modal>
    </>
  )
}

export default EditPaymentPage


export const useGetPayment = () => {
  const params = useParams();
  const { paymentId } = params;
  const savingAndPayments = useGetSaving()
  const allPayments = savingAndPayments?.payments as Payments[]
  const thisPayment = allPayments?.find(payment => payment.id === paymentId)
  return thisPayment
}