import { parse } from 'querystring'
import { useEffect, useState } from 'react'
import { useFetcher, useParams } from '@remix-run/react'
import type { ActionFunctionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import HabitEditDateForm from '~/components/forms/habits/HabitEditDateForm'
// import useInvalidItemIdAlertAndRedirect from '~/components/modals/InvalidItemIdAlertAndRedirect'

import { updateStreakSuccessById } from '~/models/habits.server';
import useFetcherState from '~/components/utilities/useFetcherState';
import useServerMessages from '~/components/modals/useServerMessages';
import useFormSubmittedToastAndRedirect from '~/components/utilities/useFormSubmittedToast';

import type { Streak } from '@prisma/client'
import type { HabitWithStreaks } from '~/types/habitTypes'
import { useSplitLoaderData } from '~/routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.habits_.$habitId';
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
    await updateStreakSuccessById({ id: streakId, isSuccess })
    return 'success'
  } catch (error) { return 'failure' }
}


function EditHabitDatePage() {

  const params = useParams();
  const habitDateId = params.dateId

  const { habit } = useSplitLoaderData()
  const loadedHabit = habit as HabitWithStreaks

  const [title, setTitle] = useState<string>('')
  const [streakObj, setStreakObj] = useState<Streak>()

  const fetcher = useFetcher();
  const { fetcherState, fetcherMessage, } = useFetcherState({ fetcher })
  useServerMessages({ fetcherMessage, fetcherState, isShowFailed: true, isShowLoading: false, isShowSuccess: false })

  const redirectRoute = '../'
  useFormSubmittedToastAndRedirect({ redirectTo: redirectRoute, message: 'Streak was changed' })


  useEffect(() => {
    if (!habitDateId) return
    if (!loadedHabit?.streak) return
    setStreakObj(loadedHabit.streak.find(streak => streak.id === habitDateId))
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
        <div className='max-w-md'>
          <HabitEditDateForm streakDateObj={streakObj} habitTitle={title} />
        </div>
      </Modal>
    </>
  )
}

export default EditHabitDatePage