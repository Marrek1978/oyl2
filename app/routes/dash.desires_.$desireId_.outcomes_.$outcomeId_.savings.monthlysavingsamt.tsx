import { parse } from 'querystring';
import { useEffect, useState } from 'react'
import { useFetcher, useRouteLoaderData } from '@remix-run/react'
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import { requireUserId } from '~/models/session.server';
import useFetcherState from '~/components/utilities/useFetcherState';
import useServerMessages from '~/components/modals/useServerMessages';
import MonthlyAmtForm from '~/components/forms/savings/MonthlyAmtForm';
import useFormSubmittedToastAndRedirect from '~/components/utilities/useFormSubmittedToast';
import { getClarifyingQIdForUserByUserId, updateMonthlySavingsAmount } from '~/models/clarifying.server';


export const loader = async ({ request }: LoaderFunctionArgs) => {
  let userId = await requireUserId(request);
  try {
    const loadedQuestionsId = await getClarifyingQIdForUserByUserId(userId);
    return loadedQuestionsId
  } catch (error) { throw error }
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.text()
  const parsedMonthlyData = parse(formData)

  const id = parsedMonthlyData.rowId as string

  const stringAmt = parsedMonthlyData.amtMonthly as string
  const stripedMonthlyAmt = stringAmt.replace(/[^0-9.-]+/g, '');
  const monthlyAmount = parseInt(stripedMonthlyAmt)

  try {
    await updateMonthlySavingsAmount({ monthlyAmount, id })
    return 'success'
  } catch (error) { return 'failure' }
}


function MonthlySavingsAmtFormPage() {

  const CqId = useGetCQId()

  const fetcher = useFetcher();
  const { fetcherState, fetcherMessage, } = useFetcherState({ fetcher })
  useServerMessages({ fetcherMessage, fetcherState, isShowFailed: true, isShowLoading: false, isShowSuccess: false })

  useFormSubmittedToastAndRedirect({ redirectTo: '../', message: 'Contribution amount was changed' })

  return (
    <>
      <Modal onClose={() => { }} zIndex={20}>
        <MonthlyAmtForm CqId={CqId} />
      </Modal>
    </>
  )
}

export default MonthlySavingsAmtFormPage


export const useGetLoaderData = (path: string = "routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.savings.monthlysavingsamt") => {
  const fromDb = useRouteLoaderData(path)
  return fromDb
}


export const useGetCQId = (): string => {
  const loadedId = useGetLoaderData()
  const [CQId, setCQId] = useState<string>('0')

  useEffect(() => {
    if (!loadedId || loadedId === undefined) return
    const id = loadedId as string
    if (!id) return
    setCQId(id)
  }, [loadedId])

  return CQId
}