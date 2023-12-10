import { useEffect, useState } from 'react'
import { useParams } from '@remix-run/react'

import Modal from '~/components/modals/Modal'
import HabitEditDateForm from '~/components/forms/habits/HabitEditDateForm'
import { useSplitLoaderData } from './dash.desires_.$desireId_.outcomes_.$outcomeId_.habits_.$habitId'
// import useInvalidItemIdAlertAndRedirect from '~/components/modals/InvalidItemIdAlertAndRedirect'

import type { Streak } from '@prisma/client'
import type { HabitWithStreaks } from '~/types/habitTypes'



function EditHabitDatePage() {

  const params = useParams();
  const habitDateId = params.dateId

  const { habit } = useSplitLoaderData()
  const loadedHabit = habit as HabitWithStreaks
  const [streakObj, setStreakObj] = useState<Streak>()
  const [title, setTitle] = useState<string>('')

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