import { parse } from "querystring";
import { redirect } from "@remix-run/node";
import { useEffect, useState } from "react";
import { Outlet, useLoaderData, useRouteLoaderData } from "@remix-run/react";

import { requireUserId } from '~/models/session.server';
import { getOutcomeByOutcomeId } from '~/models/outcome.server';
import BreadCrumbs from "~/components/breadCrumbTrail/BreadCrumbs";
import DndAndFormFlex from "~/components/baseContainers/DndAndFormFlex";

import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/server-runtime';
import { getDesireById } from "~/models/desires.server";
import HabitForm from "~/components/forms/habits/HabitForm";
import { createHabit, getHabitById, getHabitsByOutcomeId, updateHabitsOrder } from "~/models/habits.server";
import DndHabits from "~/components/dnds/habits/DndHabits";
import type { HabitWithStreaks } from "~/types/habitTypes";
import type { Habit } from "@prisma/client";
import Modal from "~/components/modals/Modal";
import BasicTextAreaBG from "~/components/baseContainers/BasicTextAreaBG";
import PageTitle from "~/components/titles/PageTitle";
import HabitDisplay from "~/components/habits/HabitDisplay";
import HabitStreakForm from "~/components/forms/habits/HabitStreakForm";



export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let userId = await requireUserId(request);
  const { outcomeId, desireId, habitId } = params;
  if (!desireId) return redirect('../../../..')
  if (!outcomeId) return redirect('../..')
  if (!habitId) return redirect('..')

  try {
    const desire = await getDesireById(desireId, userId);
    if (!desire) return 'noDesireId'
    const loadedDesireName = desire.title
    const outcome = await getOutcomeByOutcomeId(outcomeId);
    if (!outcome) return "noOutcomeId"
    const loadedOutcomeName = outcome.title
    const loadedHabit = await getHabitById(habitId);
    return { loadedHabit, loadedDesireName, loadedOutcomeName }
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


function HabitPage() {

  const { desireName, outcomeName } = useGetParamNames()
  const habit = useGetHabit() as HabitWithStreaks

  const unTrackedDatesArray = useGetUnTrackedDatesArray(habit)
  
  // useEffect(() => {
  //   if (!loadedGroupsData) return
  //   setGroups(loadedGroupsData);
  // }, [loadedGroupsData])


  return (
    <>
      <BreadCrumbs secondCrumb={desireName || 'Desire'} title2={outcomeName || 'Outcome'} title3={habit?.title} />
      <Outlet />
      <DndAndFormFlex
        listMaxWidthTW={'max-w-max'}
        dnd={<HabitDisplay habit={habit} />}
        form={<HabitStreakForm habit={habit} unTrackedDays={unTrackedDatesArray} />}
      />
    </>
  )
}

export default HabitPage



export const useGetLoaderData = () => {
  const fromDb = useLoaderData()
  return fromDb
}

interface LoaderData {
  loadedHabit: Habit
  loadedDesireName: string
  loadedOutcomeName: string
}


export const useSplitLoaderData = () => {
  const loadedData = useGetLoaderData()
  const [habit, setHabit] = useState<Habit>();
  const [desireName, setDesireName] = useState<string>('')
  const [outcomeName, setOutcomeName] = useState<string>('')

  useEffect(() => {
    if (!loadedData || loadedData === undefined) return
    const data = loadedData as LoaderData
    if (!data) return
    const { loadedHabit, loadedDesireName, loadedOutcomeName } = data
    loadedHabit && setHabit(loadedHabit)
    loadedDesireName && setDesireName(loadedDesireName)
    loadedOutcomeName && setOutcomeName(loadedOutcomeName)
  }, [loadedData])

  return { habit, desireName, outcomeName }
}

export const useGetParamNames = (): { desireName: string, outcomeName: string } => {
  const { desireName, outcomeName } = useSplitLoaderData()
  return { desireName, outcomeName }
}


export const useGetHabit = () => {
  const { habit } = useSplitLoaderData()
  return habit
}

export const useGetUnTrackedDatesArray = (habit: HabitWithStreaks) => {


  const startDate = habit?.startDate
  const today = new Date()
  // const streakInDescOrder = habit?.streaks?.sort((a, b) => { return b.date.getTime() - a.date.getTime() })


  //make an array of dates starting at startDate adn ending at today
  let unTrackedDatesArray = []

  if (startDate) {
    let date = new Date(startDate)
    while (date <= today) {
      unTrackedDatesArray.push(new Date(date))
      date.setDate(date.getDate() + 1)
    }
  }

  return unTrackedDatesArray


}







