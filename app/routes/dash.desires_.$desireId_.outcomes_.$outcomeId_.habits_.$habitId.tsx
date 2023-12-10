import { parse } from "querystring";
import { redirect } from "@remix-run/node";
import { useEffect, useState } from "react";
import { Outlet, useRouteLoaderData } from "@remix-run/react";

import { requireUserId } from '~/models/session.server';
import { getDesireById } from "~/models/desires.server";
import HabitDisplay from "~/components/habits/HabitDisplay";
import { getOutcomeByOutcomeId } from '~/models/outcome.server';
import BreadCrumbs from "~/components/breadCrumbTrail/BreadCrumbs";
import HabitDatesForm from "~/components/forms/habits/HabitDatesForm";
import { addStreakDates, getHabitById, } from "~/models/habits.server";
import DndAndFormFlex from "~/components/baseContainers/DndAndFormFlex";
import { ArrayOfObjectsStrToDates } from "~/components/utilities/helperFunctions";

import type { Habit, Streak } from "@prisma/client";
import type { HabitWithStreaks, StreakDataEntriesType } from "~/types/habitTypes";
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/server-runtime';


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

  const habit = useGetHabit() as HabitWithStreaks
  const { desireName, outcomeName } = useGetParamNames()

  const { existingStreaks, untrackedDatesFromToday } = useGetStreakArrays()


  return (
    <>
      <BreadCrumbs secondCrumb={desireName || 'Desire'} title2={outcomeName || 'Outcome'} title3={habit?.title} />
      <Outlet />
      <DndAndFormFlex
        listMaxWidthTW={'max-w-max'}
        formMaxWidthTW={'max-w-sm'}
        dnd={<HabitDisplay habit={habit} existingStreaks={existingStreaks} />}
        form={<HabitDatesForm habit={habit} unTrackedDays={untrackedDatesFromToday} />}
      />
    </>
  )
}

export default HabitPage


const path = 'routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.habits_.$habitId'

export const useGetLoaderData = () => {
  const fromDb = useRouteLoaderData(path)
  return fromDb
}

interface LoaderData {
  loadedHabit: HabitWithStreaks
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
    loadedDesireName && setDesireName(loadedDesireName)
    loadedOutcomeName && setOutcomeName(loadedOutcomeName)

    if (loadedHabit) {
      const streaksWithStringDates = loadedHabit.streak
      const streaksWithProperDates = ArrayOfObjectsStrToDates({ items: streaksWithStringDates, dateKeys: ['date', 'createdAt', 'updatedAt'] }) as Streak[]
      const updatedHabit = { ...loadedHabit, streak: streaksWithProperDates }
      setHabit(updatedHabit)
    }

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

export const useGetStreakArrays = () => {
  const habit = useGetHabit() as HabitWithStreaks
  const [startDate, setStartDate] = useState<Date>()
  const [existingStreaks, setExistingStreaks] = useState<Streak[]>([])
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
    today.setHours(0, 0, 0, 0)
    if (!startDate) return
    let maxTrackedDate = new Date(startDate)
    if (existingStreaks.length > 0) maxTrackedDate = new Date(existingStreaks[0].date)
    maxTrackedDate.setHours(0, 0, 0, 0)

    if (today >= maxTrackedDate) {
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









