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
import useFetcherState from "~/components/utilities/useFetcherState";
import useServerMessages from "~/components/modals/useServerMessages";
import DndAndFormFlex from "~/components/baseContainers/DndAndFormFlex";
import { createSaving, getSavingsByOutcomeId, updateSavingsOrder } from "~/models/saving.server";

import type { ClarifyingQuestions, Savings } from "@prisma/client";
import { getClarifyingQuestions } from "~/models/clarifying.server";



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
    const loadedSavings = await getSavingsByOutcomeId(outcomeId);
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
    console.log(' posting ')
    const formData = await request.text()
    const parsedSavingData = parse(formData)

    const title = parsedSavingData.title as string
    const description = parsedSavingData.description as string
    // const startDate = parsedSavingData.startDate ? new Date(parsedSavingData.startDate as string) : new Date()
    const sortOrder = parsedSavingData.sortOrder ? parseInt(parsedSavingData.sortOrder as string) : 0
    const outcomeId = parsedSavingData.outcomeId as string

    const requiredAmount = currStringToNum(parsedSavingData.amtRequired as string)
    const savedAmount = currStringToNum(parsedSavingData.amtSaved as string)


    try {
      await createSaving({
        title,
        description,
        sortOrder,
        requiredAmount,
        savedAmount,
        outcomeId,
      });
      return 'success'
    } catch (error) {
      return 'failure'
    }
  }
  return null
}


function SavingsPage() {

  const { desireName, outcomeName } = useGetParamNames()
  const savings = useGetSavings() as Savings[]
  const savingsArrayLength: number = useGetSavingsArrayLength()

  const fetcher = useFetcher();
  const { fetcherState, fetcherMessage, } = useFetcherState({ fetcher })
  useServerMessages({ fetcherMessage, fetcherState, isShowFailed: true, isShowLoading: false, isShowSuccess: true })

  console.log("laoding")
  // const response = useActionData()

  return (
    <>
      <BreadCrumbs secondCrumb={desireName || 'Desire'} title2={outcomeName || 'Outcome'} />
      <Outlet />
      <DndAndFormFlex
        listMaxWidthTW={'max-w-max'}
        dnd={<DndSavings passedSavings={savings} />}
        form={<SavingForm savingsArrayLength={savingsArrayLength} />}
      />
    </>
  )
}

export default SavingsPage



export const useGetLoaderData = (path: string = "routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.savings") => {
  const fromDb = useRouteLoaderData(path)
  return fromDb
}

interface LoaderData {
  loadedSavings: Savings[]
  loadedDesireName: string
  loadedOutcomeName: string
  loadedMonthlyAmount:number
}


export const useSplitLoaderData = () => {
  const loadedData = useGetLoaderData()
  const [savings, setSavings] = useState<Savings[]>([]);
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

  return { savings, desireName, outcomeName , monthlyAmount}
}

export const useGetParamNames = (): { desireName: string, outcomeName: string } => {
  const { desireName, outcomeName } = useSplitLoaderData()
  return { desireName, outcomeName }
}


export const useGetSavings = () => {
  const { savings } = useSplitLoaderData()
  return savings
}

export const useGetSavingsArrayLength = () => {
  const savings = useGetSavings()
  return savings.length
}

export const useGetMonthlySavingsAmount = () => {
  const { monthlyAmount } = useSplitLoaderData()
  return monthlyAmount
}




