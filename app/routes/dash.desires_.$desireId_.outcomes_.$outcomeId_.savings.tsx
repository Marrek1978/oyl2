import { parse } from "querystring";
import { redirect } from "@remix-run/node";
import { useEffect, useState } from "react";
import { Outlet, useFetcher, useRouteLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/server-runtime';

import { requireUserId } from '~/models/session.server';
import { getDesireById } from "~/models/desires.server";
import DndSavings from "~/components/dnds/savings/DndSavings";
import SavingForm from "~/components/forms/savings/SavingForm";
import { getOutcomeByOutcomeId } from '~/models/outcome.server';
import BreadCrumbs from "~/components/breadCrumbTrail/BreadCrumbs";
import { getClarifyingQuestions } from "~/models/clarifying.server";
import useFetcherState from "~/components/utilities/useFetcherState";
import useServerMessages from "~/components/modals/useServerMessages";
import DndAndFormFlex from "~/components/baseContainers/DndAndFormFlex";
import { createSaving, getSavingsWithPaymentsByOutcomeId, updateSavingsOrder } from "~/models/saving.server";

import type { ClarifyingQuestions, Payments } from "@prisma/client";
import type { SavingsAndPayments, SavingsAndPaymentsWithStrDates } from "~/types/savingsType";
import { ArrayOfObjectsStrToDates, ObjectStrToDates } from "~/components/utilities/helperFunctions";



export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let userId = await requireUserId(request);
  const { outcomeId, desireId } = params;
  if (!desireId) return redirect('../../../..')
  if (!outcomeId) return redirect('../..')
  const usersData = await getClarifyingQuestions(userId);
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
    const loadedSavings = await getSavingsWithPaymentsByOutcomeId(outcomeId);

    return { loadedSavings, loadedDesireName, loadedOutcomeName, loadedMonthlyAmount }
  } catch (error) { throw error }
};

const currStringToNum = (currString: string): number => {
  const numString = currString.replace(/[^0-9.-]+/g, '');
  const num = parseInt(numString)
  return num
}

export const action = async ({ request, params }: ActionFunctionArgs) => {

  if (request.method === 'PUT') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const groupsObj = JSON.parse(parsedBody.toServerDataString as string);
    const groups = groupsObj.sortableArray
    try {
      await updateSavingsOrder(groups)
      return 'success'
    } catch (error) { return 'failure' }
  }

  if (request.method === 'POST') {
    const formData = await request.text()
    const parsedSavingData = parse(formData)

    const title = parsedSavingData.title as string
    const description = parsedSavingData.description as string
    // const startDate = parsedSavingData.startDate ? new Date(parsedSavingData.startDate as string) : new Date()
    const sortOrder = parsedSavingData.sortOrder ? parseInt(parsedSavingData.sortOrder as string) : 0
    const outcomeId = parsedSavingData.outcomeId as string

    const requiredAmount = currStringToNum(parsedSavingData.amtRequired as string)
    const savedAmount = currStringToNum(parsedSavingData.amtSaved as string)
    const payment = {
      amount: savedAmount,
      paymentDate: new Date(),
    }

    try {
      await createSaving({
        title,
        description,
        sortOrder,
        requiredAmount,
        payment, // as initial Payment
        outcomeId,
      });
      return 'success'
    } catch (error) {
      return 'failure'
    }
  }
  return null
}


const path: string = "routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.savings"


function SavingsPage() {

  const { desireName, outcomeName } = useGetParamNames(path)
  const savings = useGetSavingsWithPayments(path) as SavingsAndPayments[]
  const savingsArrayLength: number = useGetSavingsArrayLength(path)

  const fetcher = useFetcher();
  const { fetcherState, fetcherMessage, } = useFetcherState({ fetcher })
  useServerMessages({ fetcherMessage, fetcherState, isShowFailed: true, isShowLoading: false, isShowSuccess: true })

  // const response = useActionData()

  return (
    <>
      <BreadCrumbs secondCrumb={desireName || 'Desire'} title2={outcomeName || 'Outcome'} />
      <Outlet />
      <DndAndFormFlex
        listMaxWidthTW={'max-w-xl'}
        dnd={<DndSavings passedSavings={savings} path={path} />}
        form={<SavingForm savingsArrayLength={savingsArrayLength} />}
      />
    </>
  )
}

export default SavingsPage



export const useGetLoaderData = (path: string) => {
  const fromDb = useRouteLoaderData(path)
  return fromDb
}

interface LoaderData {
  loadedSavings: SavingsAndPaymentsWithStrDates[]
  loadedDesireName: string
  loadedOutcomeName: string
  loadedMonthlyAmount: number
}

interface SplitData {
  savings: SavingsAndPaymentsWithStrDates[]
  desireName: string
  outcomeName: string
  monthlyAmount: number
}


export const useSplitLoaderData = (path: string): SplitData => {
  const loadedData = useGetLoaderData(path) as LoaderData
  const [savings, setSavings] = useState<SavingsAndPaymentsWithStrDates[]>([]);
  const [desireName, setDesireName] = useState<string>('')
  const [outcomeName, setOutcomeName] = useState<string>('')
  const [monthlyAmount, setMonthlyAmount] = useState<number>(0)

  useEffect(() => {
    if (!loadedData || loadedData === undefined) return
    const data = loadedData as LoaderData
    if (!data) return
    const { loadedSavings, loadedDesireName, loadedOutcomeName, loadedMonthlyAmount } = data
    loadedSavings && setSavings(loadedSavings)
    loadedDesireName && setDesireName(loadedDesireName)
    loadedOutcomeName && setOutcomeName(loadedOutcomeName)
    loadedMonthlyAmount && setMonthlyAmount(loadedMonthlyAmount)
  }, [loadedData])

  return { savings, desireName, outcomeName, monthlyAmount }
}

export const useGetParamNames = (path: string): { desireName: string, outcomeName: string } => {
  const { desireName, outcomeName } = useSplitLoaderData(path)
  return { desireName, outcomeName }
}


export const useGetSavingsWithPayments = (path: string): SavingsAndPayments[] => {
  const { savings } = useSplitLoaderData(path)
  const [savingsWithPayments, setSavingsWithPayments] = useState<SavingsAndPayments[]>([])

  useEffect(() => {
    if (!savings || savings.length === 0) return
    const savingsWithStringDatesArray = savings as SavingsAndPaymentsWithStrDates[]

    const savingsWithProperDates = savingsWithStringDatesArray.map((savingWithStrDatesAndPayments) => {
      const savingWithProperDates = ObjectStrToDates({ item: savingWithStrDatesAndPayments, dateKeys: ['createdAt', 'updatedAt'] }) as SavingsAndPayments
      const paymentsWithProperDates = ArrayOfObjectsStrToDates({ items: savingWithStrDatesAndPayments.payments, dateKeys: ['paymentDate', 'createdAt', 'updatedAt'] }) as Payments[]
      return { ...savingWithProperDates, payments: paymentsWithProperDates }
    })

    setSavingsWithPayments(savingsWithProperDates)
  }, [savings])

  return savingsWithPayments
}

export const useGetSavingsArrayLength = (path: string): number => {
  const savings = useGetSavingsWithPayments(path)
  return savings.length
}

export const useGetMonthlySavingsAmount = (path: string): number => {
  const { monthlyAmount } = useSplitLoaderData(path)
  return monthlyAmount
}




