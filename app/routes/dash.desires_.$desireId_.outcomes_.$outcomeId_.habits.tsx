import { parse } from "querystring";
import { redirect } from "@remix-run/node";
import { useEffect, useState } from "react";
import { Outlet, useRouteLoaderData } from "@remix-run/react";

import { requireUserId } from '~/models/session.server';
import { getOutcomeByOutcomeId } from '~/models/outcome.server';
import BreadCrumbs from "~/components/breadCrumbTrail/BreadCrumbs";
import DndAndFormFlex from "~/components/baseContainers/DndAndFormFlex";

import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/server-runtime';
import { getDesireById } from "~/models/desires.server";
import HabitForm from "~/components/forms/habits/HabitForm";
import { createHabit, getHabitsByOutcomeId, updateHabitsOrder } from "~/models/habits.server";
import DndHabits from "~/components/dnds/habits/DndHabits";
import type { HabitWithStreaks } from "~/types/habitTypes";
import type { Habit } from "@prisma/client";



export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let userId = await requireUserId(request);
  const { outcomeId, desireId } = params;
  if (!desireId) return redirect('../../../..')
  if (!outcomeId) return redirect('../..')

  try {
    const desire = await getDesireById(desireId, userId);
    if (!desire) return 'noDesireId'
    const loadedDesireName = desire.title
    const outcome = await getOutcomeByOutcomeId(outcomeId);
    if (!outcome) return "noOutcomeId"
    const loadedOutcomeName = outcome.title
    const loadedHabits = await getHabitsByOutcomeId(outcomeId);
    return { loadedHabits, loadedDesireName, loadedOutcomeName }
  } catch (error) { throw error }
};


export const action = async ({ request, params }: ActionFunctionArgs) => {

  if (request.method === 'PUT') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const groupsObj = JSON.parse(parsedBody.toServerDataString as string);
    const groups = groupsObj.sortableArray
    try {
      await updateHabitsOrder(groups)
      return 'success'
    } catch (error) { return 'failure' }
  }

  if (request.method === 'POST') {
    const formData = await request.text()
    const parsedHabitData = parse(formData)

    if (!parsedHabitData.habitString) return 'failure'
    const habitData = JSON.parse(parsedHabitData.habitString as string);

    const title = habitData.title as string
    const description = habitData.description as string
    const startDate = habitData.startDate ? new Date(habitData.startDate as string) : new Date()
    const sortOrder = habitData.sortOrder ? parseInt(habitData.sortOrder as string) : 0
    const outcomeId = habitData.outcomeId as string

    try {
      await createHabit({ title, description, startDate, sortOrder, outcomeId });
      return 'success'
    } catch (error) { return 'failure' }
  }

  return null
}


function HabitsPage() {

  const { desireName, outcomeName } = useGetParamNames()
  const habits = useGetHabits() as HabitWithStreaks[]
  const habitsArrayLength:number = useGetHabitsArrayLength()


  return (
    <>
      <BreadCrumbs secondCrumb={desireName || 'Desire'} title2={outcomeName || 'Outcome'} />
      <Outlet />
      <DndAndFormFlex
        listMaxWidthTW={'max-w-max'}
        dnd={<DndHabits passedHabits={habits} />}
        form={<HabitForm habitsArrayLength={habitsArrayLength} />}
      />
    </>
  )
}

export default HabitsPage



export const useGetLoaderData = (path: string = "routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.habits") => {
  const fromDb = useRouteLoaderData(path)
  return fromDb
}

interface LoaderData {
  loadedHabits: Habit[]
  loadedDesireName: string
  loadedOutcomeName: string
}


export const useSplitLoaderData = () => {
  const loadedData = useGetLoaderData()
  const [habits, setHabits] = useState<Habit[]>([]);
  const [desireName, setDesireName] = useState<string>('')
  const [outcomeName, setOutcomeName] = useState<string>('')

  useEffect(() => {
    if (!loadedData || loadedData === undefined) return
    const data = loadedData as LoaderData
    if (!data) return
    const { loadedHabits, loadedDesireName, loadedOutcomeName } = data
    loadedHabits && setHabits(loadedHabits)
    loadedDesireName && setDesireName(loadedDesireName)
    loadedOutcomeName && setOutcomeName(loadedOutcomeName)
  }, [loadedData])

  return { habits, desireName, outcomeName }
}

export const useGetParamNames = (): { desireName: string, outcomeName: string } => {
  const { desireName, outcomeName } = useSplitLoaderData()
  return { desireName, outcomeName }
}


export const useGetHabits = () => {
  const { habits } = useSplitLoaderData()
  return habits
}

export const useGetHabitsArrayLength = () => {
  const habits = useGetHabits()
  return habits.length
}





