import { parse } from 'querystring';
import { redirect } from "@remix-run/node";
import { useEffect, useState } from 'react';
import { Outlet } from '@remix-run/react'
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/server-runtime';

import { getDesireById } from '~/models/desires.server';
import { requireUserId } from '~/models/session.server';
import { createPayment } from '~/models/payment.server';
import { getOutcomeByOutcomeId } from '~/models/outcome.server';
import SavingDisplay from '~/components/savings/SavingDisplay';
import PaymentForm from '~/components/forms/savings/PaymentForm';
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs'
import { getSavingWithPaymentsById } from '~/models/saving.server';
import { getClarifyingQuestions } from "~/models/clarifying.server";
import DndAndFormFlex from '~/components/baseContainers/DndAndFormFlex'
import { useGetLoaderData } from "./dash.desires_.$desireId_.outcomes_.$outcomeId_.savings";
import { ArrayOfObjectsStrToDates, ObjectStrToDates } from "~/components/utilities/helperFunctions";


import type { CreatePayment } from '~/types/paymentTypes';
import type { ClarifyingQuestions, Payments } from '@prisma/client';
import type { SavingsAndPayments, SavingsAndPaymentsWithStrDates } from "~/types/savingsType";


export const loader = async ({ request, params }: LoaderFunctionArgs) => {

  let userId = await requireUserId(request);
  const { outcomeId, desireId, savingId } = params;
  if (!desireId) return redirect('../../../..')
  if (!outcomeId) return redirect('../..')
  if (!savingId) return redirect('..')
  const usersData = await getClarifyingQuestions(userId);
  //!!!  no, set a note to update it
  if (!usersData) return redirect('../..')
  const loadedUserData = usersData[0] as ClarifyingQuestions
  const loadedMonthlyAmount = loadedUserData.monthlyAmount

  try {
    const desire = await getDesireById(desireId, userId);
    if (!desire) return 'noDesireId'
    const loadedDesireName = desire.title
    const outcome = await getOutcomeByOutcomeId(outcomeId);
    if (!outcome) return "noOutcomeId"
    const loadedOutcomeName = outcome.title
    const loadedSaving = await getSavingWithPaymentsById(savingId);
    return { loadedSaving, loadedDesireName, loadedOutcomeName, loadedMonthlyAmount }
  } catch (error) { throw error }
};


export const action = async ({ request }: ActionFunctionArgs) => {

  if (request.method === 'POST') {
    const formData = await request.text()
    const parsedData = parse(formData)
    const paymentData = JSON.parse(parsedData?.paymentString as string)

    const payment: CreatePayment = {
      savingsId: paymentData?.savingsId as string,
      paymentDate: new Date(paymentData?.paymentDate?.toString() || new Date()),
      amount: parseInt(paymentData?.amount?.toString() || 0)
    }

    try {
      await createPayment(payment)
      return "success"
    } catch (error) {
      return 'failure'
    }
  }
  return null
}


const thisPath = 'routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.savings_.$savingId'

function SavingPage() {

  const saving = useGetSaving(thisPath) as SavingsAndPayments
  const { desireName, outcomeName } = useGetParamNames(thisPath)

  return (
    <>
      <>
        <BreadCrumbs secondCrumb={desireName || 'Desire'} title2={outcomeName || 'Outcome'} title3={saving?.title} />
        <Outlet />
        <DndAndFormFlex
          listMaxWidthTW={'max-w-max'}
          formMaxWidthTW={'max-w-sm'}
          dnd={<SavingDisplay passedSaving={saving} path={thisPath} />}
          form={<PaymentForm passedSavingsId={saving?.id} />}
        />
      </>
    </>
  )
}

export default SavingPage

interface LoaderData {
  loadedSaving: SavingsAndPaymentsWithStrDates
  loadedDesireName: string
  loadedOutcomeName: string
  loadedMonthlyAmount: number
}

interface SplitData {
  saving: SavingsAndPayments | undefined
  desireName: string
  outcomeName: string
  monthlyAmount: number
}

export const useSplitLoaderData = (path: string): SplitData => {
  const loadedData = useGetLoaderData(path)
  const [saving, setSaving] = useState<SavingsAndPayments>();
  const [desireName, setDesireName] = useState<string>('')
  const [outcomeName, setOutcomeName] = useState<string>('')
  const [monthlyAmount, setMonthlyAmount] = useState<number>(0)


  useEffect(() => {
    if (!loadedData || loadedData === undefined) return
    const data = loadedData as LoaderData
    if (!data) return
    const { loadedSaving, loadedDesireName, loadedOutcomeName, loadedMonthlyAmount } = data
    loadedDesireName && setDesireName(loadedDesireName)
    loadedOutcomeName && setOutcomeName(loadedOutcomeName)
    loadedMonthlyAmount && setMonthlyAmount(loadedMonthlyAmount)

    // if (!loadedSaving || loadedSaving === undefined) return
    const savingAndPaymentsWithStrDates = loadedSaving as SavingsAndPaymentsWithStrDates
    const savingWithProperDates = ObjectStrToDates({ item: savingAndPaymentsWithStrDates, dateKeys: ['createdAt', 'updatedAt'] }) as SavingsAndPayments
    const paymentsWithProperDates = ArrayOfObjectsStrToDates({ items: savingAndPaymentsWithStrDates.payments, dateKeys: ['paymentDate', 'createdAt', 'updatedAt'] }) as Payments[]
    const savingAndPayments = { ...savingWithProperDates, payments: paymentsWithProperDates }

    setSaving(savingAndPayments)
  }, [loadedData])

  return { saving, desireName, outcomeName, monthlyAmount }
}

export const useGetParamNames = (path: string): { desireName: string, outcomeName: string } => {
  const { desireName, outcomeName } = useSplitLoaderData(path)
  return { desireName, outcomeName }
}

export const useGetSaving = (path: string = thisPath): SavingsAndPayments => {
  const { saving } = useSplitLoaderData(path)
  return saving as SavingsAndPayments
}

export const useGetTotalPayments = (path: string): number => {
  const saving = useGetSaving(path)
  const totalPayments = saving?.payments?.reduce((total, payment) => {
    return total + payment.amount
  }, 0)
  return totalPayments
}

export const useGetMonthlySavingsAmount = (path: string): number => {
  const { monthlyAmount } = useSplitLoaderData(path)
  return monthlyAmount
}

