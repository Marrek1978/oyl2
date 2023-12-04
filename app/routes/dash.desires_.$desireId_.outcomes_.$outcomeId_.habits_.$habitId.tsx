import { parse } from "querystring";
import { redirect } from "@remix-run/node";
import { useEffect, useMemo, useState } from "react";
import { Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from '~/models/session.server';
import { getDesireById } from "~/models/desires.server";
import HabitDisplay from "~/components/habits/HabitDisplay";
import { getOutcomeByOutcomeId } from '~/models/outcome.server';
import BreadCrumbs from "~/components/breadCrumbTrail/BreadCrumbs";
import DndAndFormFlex from "~/components/baseContainers/DndAndFormFlex";
import HabitStreakForm from "~/components/forms/habits/HabitStreakForm";
import { addStreakDates, getHabitById, } from "~/models/habits.server";

import type { Habit, Streak } from "@prisma/client";
import type { HabitWithStreaks, StreakDataEntriesType } from "~/types/habitTypes";
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/server-runtime';
import { toast } from 'sonner';
import { max } from "date-fns";
import { ArrayOfObjectsStrToDates } from "~/components/utilities/helperFunctions";


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

  if (request.method === 'POST') {
    const formData = await request.text()
    const parsedStreakData = parse(formData)
    if (!parsedStreakData) return 'failure'
    const { rowId, ...streakData } = parsedStreakData //streakData is an object with keys of dates and values of true or false
    const habitId = rowId as string

    const streakDataEntries: StreakDataEntriesType[] = []
    for (const [key, value] of Object.entries(streakData)) {
      if (key !== 'rowId') {
        const date = new Date(key)
        date.setHours(0, 0, 0, 0)

        streakDataEntries.push({
          date: date,
          isSuccess: value === 'on' ? true : false,
          habitId,
        })
      }
    }

    try {
      await addStreakDates(streakDataEntries);
      return 'success'
    } catch (error) { return 'failure' }
  }

  return null
}


function HabitPage() {

  const { desireName, outcomeName } = useGetParamNames()
  const habit = useGetHabit() as HabitWithStreaks

  const { existingStreaks, untrackedDatesFromToday } = useGetStreakArrays(habit)
  console.log("🚀 ~ file: dash.desires_.$desireId_.outcomes_.$outcomeId_.habits_.$habitId.tsx:82 ~ HabitPage ~ existingStreaks:", existingStreaks)

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
        dnd={<HabitDisplay habit={habit} existingStreaks={existingStreaks} />}
        form={<HabitStreakForm habit={habit} unTrackedDays={untrackedDatesFromToday} />}
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

export const useGetStreakArrays = (habit: HabitWithStreaks) => {
  // console.log("🚀 ~ file: dash.desires_.$desireId_.outcomes_.$outcomeId_.habits_.$habitId.tsx:148 ~ useGetStreakArrays ~ habit:", habit)

  const [startDate, setStartDate] = useState<Date>()
  const [existingStreaks, setExistingStreaks] = useState<Streak[]>([])
  console.log("🚀 ~ file: dash.desires_.$desireId_.outcomes_.$outcomeId_.habits_.$habitId.tsx:153 ~ useGetStreakArrays ~ existingStreaks:", existingStreaks)
  const [untrackedDatesFromToday, setUntrackedDatesFromToday] = useState<Date[]>([])


  useEffect(() => {
    if (!habit) return
    if (habit.startDate) setStartDate(habit.startDate)
    if (!habit.startDate) setStartDate(new Date())
    if (habit.streak) {
      const streaksWithProperDates = ArrayOfObjectsStrToDates({ items: habit.streak, dateKeys: ['date', 'createdAt', 'updatedAt'] }) as Streak[]
      const streakInDescOrder = streaksWithProperDates.sort((a, b) => { return b.date.getTime() - a.date.getTime() })
      setExistingStreaks(streakInDescOrder)
    }
  }, [habit])


  useEffect(() => {
    const today = new Date()
    let maxTrackedDate = new Date()
    if (existingStreaks.length > 0) maxTrackedDate = existingStreaks[0].date

    if (today > maxTrackedDate) {
      let unTrackedDatesArray = []

      let date = new Date(maxTrackedDate)
      date.setDate(date.getDate() + 1)

      while (date <= today) {
        unTrackedDatesArray.push(new Date(date))
        date.setDate(date.getDate() + 1)
      }
      setUntrackedDatesFromToday(unTrackedDatesArray)
    }
  }, [existingStreaks, startDate])




  return { existingStreaks, untrackedDatesFromToday }


}







