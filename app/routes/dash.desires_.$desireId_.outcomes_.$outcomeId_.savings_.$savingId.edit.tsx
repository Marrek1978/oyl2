import { parse } from 'querystring';
import { Outlet, redirect, useRouteLoaderData } from '@remix-run/react';

import Modal from '~/components/modals/Modal'
import { requireUserId } from '~/models/session.server';
import SavingForm from '~/components/forms/savings/SavingForm'
import { getSavingById, updateSaving } from '~/models/saving.server';
import { currStringToNum } from './dash.desires_.$desireId_.outcomes_.$outcomeId_.savings';
import useFormSubmittedToastAndRedirect from '~/components/utilities/useFormSubmittedToast';

import type { Savings } from '@prisma/client';
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/server-runtime';


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireUserId(request);
  const { savingId } = params;
  if (!savingId) return redirect('../')

  try {
    const loadedSaving = await getSavingById(savingId);
    return { loadedSaving }
  } catch (error) { throw error }
};

export const action = async ({ request, params }: ActionFunctionArgs) => {

  const formData = await request.text()
  const parsedSavingData = parse(formData)
  const id = parsedSavingData.rowId as string
  const title = parsedSavingData.title as string
  const description = parsedSavingData.description as string
  const requiredAmount = currStringToNum(parsedSavingData?.amtRequired?.toString() || '0')

  try {
    await updateSaving({
      id,
      title,
      description,
      requiredAmount,
      // payment, // as initial Payment
    });
    return 'success'
  } catch (error) {
    return 'failure'
  }
}



function EditSavingPage() {
  const saving = useGetLoaderData()

  useFormSubmittedToastAndRedirect({ redirectTo: '../', message: 'Saving was updated' })

  return (
    <>
      <Outlet />
      <Modal onClose={() => { }} zIndex={10}>
        <SavingForm isNew={false} passedSaving={saving} />
      </Modal>
    </>
  )
}

export default EditSavingPage


export const useGetLoaderData = (path: string = "routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.savings_.$savingId.edit"): Savings => {
  const fromDb = useRouteLoaderData(path)
  const savingObj = fromDb as { loadedSaving: Savings }
  const saving = savingObj.loadedSaving
  return saving
}
