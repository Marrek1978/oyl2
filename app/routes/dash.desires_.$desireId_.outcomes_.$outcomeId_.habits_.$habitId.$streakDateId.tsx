import { useEffect, useState } from 'react'
import { useParams } from '@remix-run/react'

import Modal from '~/components/modals/Modal'
import StreakDateForm from '~/components/forms/habits/StreakDateForm'
import { useSplitLoaderData } from './dash.desires_.$desireId_.outcomes_.$outcomeId_.habits_.$habitId'
// import useInvalidItemIdAlertAndRedirect from '~/components/modals/InvalidItemIdAlertAndRedirect'

import type { Streak } from '@prisma/client'
import type { HabitWithStreaks } from '~/types/habitTypes'



function EditStreakDatePage() {

  const params = useParams();
  const streakDateId = params.streakDateId

  const { habit } = useSplitLoaderData()
  const loadedHabit = habit as HabitWithStreaks
  const [streakObj, setStreakObj] = useState<Streak>()
  const [title, setTitle] = useState<string>('')

  useEffect(() => {
    if (!streakDateId) return
    if (!loadedHabit?.streak) return
    setStreakObj(loadedHabit.streak.find(streak => streak.id === streakDateId))
    setTitle(loadedHabit.title)
  }, [loadedHabit, streakDateId])

  // const { warning, alertMessage } = useInvalidItemIdAlertAndRedirect({ loaderData: habit, itemType: 'Streak Date' })

  return (
    <>
      {/* {warning && (
        <Modal zIndex={50}>
          {alertMessage}
        </Modal>
      )} */}

      <Modal onClose={() => { }} zIndex={10}>
        <div className='formWidth'>
          <StreakDateForm streakDateObj={streakObj} habitTitle={title} />
        </div>
      </Modal>
    </>
  )
}

export default EditStreakDatePage