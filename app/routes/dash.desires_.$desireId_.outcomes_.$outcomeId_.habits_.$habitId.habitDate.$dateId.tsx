import { parse } from 'querystring'
import { useEffect, useState } from 'react'
import { useFetcher, useParams } from '@remix-run/react'
import type { ActionFunctionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/displays/modals/Modal'
import { updateHabitDateSuccessById } from '~/models/habits.server';
import useFetcherState from '~/components/utilities/useFetcherState';
import useServerMessages from '~/components/displays/modals/useServerMessages';
import HabitEditDateForm from '~/components/forms/habits/HabitEditDateForm'
import { useSplitLoaderData } from './dash.desires_.$desireId_.outcomes_.$outcomeId_.habits_.$habitId'
import useFormSubmittedToastAndRedirect from '~/components/utilities/useFormSubmittedToast';

import type { HabitDate } from '@prisma/client';
import type { HabitWithDates } from '~/types/habitTypes';
// import useInvalidItemIdAlertAndRedirect from '~/components/modals/InvalidItemIdAlertAndRedirect';

export const action = async ({ request }: ActionFunctionArgs) => {

  const formBody = await request.text();
  const parsedStreakData = parse(formBody)
  if (!parsedStreakData) return 'failure'
  const { rowId, ...streak } = parsedStreakData
  const streakId = rowId as string
  const streakValue = Object.values(streak)
  const isSuccess = streakValue[0] === 'on' ? true : false

  try {
    await updateHabitDateSuccessById({ id: streakId, isSuccess })
    return 'success'
  } catch (error) { return 'failure' }
}


function EditHabitDatePage() {

  const params = useParams();
  const habitDateId = params.dateId

  const { habit } = useSplitLoaderData()
  const loadedHabit = habit as HabitWithDates

  const [title, setTitle] = useState<string>('')
  const [habitDate, setHabitDate] = useState<HabitDate>()

  const fetcher = useFetcher();
  const { fetcherState, fetcherMessage, } = useFetcherState({ fetcher })
  useServerMessages({ fetcherMessage, fetcherState, isShowFailed: true, isShowLoading: false, isShowSuccess: false })

  const redirectRoute = '../'
  useFormSubmittedToastAndRedirect({ redirectTo: redirectRoute, message: 'Streak was changed' })


  useEffect(() => {
    if (!habitDateId) return
    if (!loadedHabit?.habitDate) return
    setHabitDate(loadedHabit.habitDate.find(date => date.id === habitDateId))
    setTitle(loadedHabit.title)
  }, [loadedHabit, habitDateId])

  // const { warning, alertMessage } = useInvalidItemIdAlertAndRedirect({ loaderData: habit, itemType: 'Streak Date' })

  return (
    <>
      {/* {warning && (
        <Modal zIndex={50}>
          {alertMessage}
        </Modal>
      )} */}

      <Modal onClose={() => { }} zIndex={10}>
        <div className='w-full max-w-max'>
          <HabitEditDateForm habitDate={habitDate} habitTitle={title} />
        </div>
      </Modal>
    </>
  )
}

export default EditHabitDatePage