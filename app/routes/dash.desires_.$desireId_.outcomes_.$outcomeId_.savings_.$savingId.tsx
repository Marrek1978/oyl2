import { Outlet, useRouteLoaderData } from '@remix-run/react'
import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from '@remix-run/server-runtime';

import DndAndFormFlex from '~/components/baseContainers/DndAndFormFlex'
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs'
import { getDesireById } from '~/models/desires.server';
import { getOutcomeByOutcomeId } from '~/models/outcome.server';
import { getSavingById } from '~/models/saving.server';
import { requireUserId } from '~/models/session.server';
import { Savings, Streak } from '@prisma/client';
import { useEffect, useState } from 'react';
import { ArrayOfObjectsStrToDates } from '~/components/utilities/helperFunctions';
import SavingDisplay from '~/components/savings/SavingDisplay';
import PaymentForm from '~/components/forms/savings/PaymentForm';


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let userId = await requireUserId(request);
  const { outcomeId, desireId, savingId } = params;
  if (!desireId) return redirect('../../../..')
  if (!outcomeId) return redirect('../..')
  if (!savingId) return redirect('..')

  try {
    const desire = await getDesireById(desireId, userId);
    if (!desire) return 'noDesireId'
    const loadedDesireName = desire.title
    const outcome = await getOutcomeByOutcomeId(outcomeId);
    if (!outcome) return "noOutcomeId"
    const loadedOutcomeName = outcome.title
    const loadedSaving = await getSavingById(savingId);
    return { loadedSaving, loadedDesireName, loadedOutcomeName }
  } catch (error) { throw error }
};


function SavingPage() {

  const saving = useGetSaving()
  const { desireName, outcomeName } = useGetParamNames()



  return (
    <>
      <>
        <BreadCrumbs secondCrumb={desireName || 'Desire'} title2={outcomeName || 'Outcome'} title3={saving?.title} />
        <Outlet />
        <DndAndFormFlex
          listMaxWidthTW={'max-w-max'}
          formMaxWidthTW={'max-w-sm'}
          dnd={<SavingDisplay saving={saving} />}
          form={<PaymentForm />}
        />
      </>
    </>
  )
}

export default SavingPage

const path = 'routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.savings_.$savingId'

export const useGetLoaderData = () => {
  const fromDb = useRouteLoaderData(path)
  console.log("🚀 ~ file: dash.desires_.$desireId_.outcomes_.$outcomeId_.savings_.$savingId.tsx:69 ~ useGetLoaderData ~ fromDb:", fromDb)
  return fromDb
}

interface LoaderData {
  loadedSaving: Savings
  loadedDesireName: string
  loadedOutcomeName: string
}

export const useSplitLoaderData = () => {
  const loadedData = useGetLoaderData()
  const [saving, setSaving] = useState<Savings>();
  const [desireName, setDesireName] = useState<string>('')
  const [outcomeName, setOutcomeName] = useState<string>('')

  useEffect(() => {
    if (!loadedData || loadedData === undefined) return
    const data = loadedData as LoaderData
    if (!data) return
    const { loadedSaving, loadedDesireName, loadedOutcomeName } = data
    loadedDesireName && setDesireName(loadedDesireName)
    loadedOutcomeName && setOutcomeName(loadedOutcomeName)
    loadedSaving && setSaving(loadedSaving)

    // if (loadedSaving) {
    //   const savingWithStringDates = loadedSaving.streak
    //   const streaksWithProperDates = ArrayOfObjectsStrToDates({ items: streaksWithStringDates, dateKeys: ['date', 'createdAt', 'updatedAt'] }) as Streak[]
    //   const updatedHabit = { ...loadedSaving, streak: streaksWithProperDates }
    //   setSaving(updatedHabit)
    // }

  }, [loadedData])
  return { saving, desireName, outcomeName }
}


export const useGetParamNames = (): { desireName: string, outcomeName: string } => {
  const { desireName, outcomeName } = useSplitLoaderData()
  return { desireName, outcomeName }
}

export const useGetSaving = ():Savings => {
  const { saving } = useSplitLoaderData()
  return saving as Savings
}
