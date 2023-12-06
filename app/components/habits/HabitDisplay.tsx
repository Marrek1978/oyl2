
import DateDisplay from './DateDisplay'
import PageTitle from '../titles/PageTitle'
import HeadingH1 from '../titles/HeadingH1'
import HeadingH3 from '../titles/HeadingH3'
import HeadingH4 from '../titles/HeadingH4'

import type { Streak } from '@prisma/client'
import type { HabitWithStreaks } from '~/types/habitTypes'
import { useEffect, useState } from 'react'


type Props = {
  habit: HabitWithStreaks
  existingStreaks: Streak[]
}

function HabitDisplay({ habit, existingStreaks }: Props) {
  const streaks = useGetStreaks(habit)

  let currentStreak
  let secondStreak
  let thirdStreak
  if (streaks) {
    currentStreak = streaks[0]
    secondStreak = streaks[1]
    thirdStreak = streaks[2]
  }


  return (
    <>
      <PageTitle text={'Habit'} />
      <div className='mt-2  '>
        <HeadingH1 H1Title={habit?.title} />
      </div>
      <div className='mt-6  '>
        <HeadingH3 text={`Current Streak ${currentStreak || 0} days`} />
        <div className='flex flex-wrap gap-2'>
          {secondStreak && (
            <HeadingH4 text={`Recent Streaks ${secondStreak || ''} days `} />
          )}
          {thirdStreak && (
            <HeadingH4 text={` , ${thirdStreak || ''}`} />
          )}
        </div>
      </div >
      <div className='mt-6  '>
        {existingStreaks && existingStreaks?.map((streakObj, index) => {
          return (<DateDisplay key={index} streakObj={streakObj} />)
        })}

      </div>
    </>
  )
}

export default HabitDisplay


export const useGetStreaks = (habit: HabitWithStreaks) => {
  const [lastThreeStreaks, setLastThreeStreaks] = useState<number[]>()

  useEffect(() => {
    if (!habit || !habit.streak) return

    let counter = 0
    let isCounting = false
    const allTrackedDates: Streak[] = habit?.streak
    let streaksArray: number[] = []

    for (let i = 0; i < allTrackedDates.length; i++) {
      const trackedDate = allTrackedDates[i]

      if (trackedDate.isSuccess) {
        counter++
        isCounting = true
      }

      if (!trackedDate.isSuccess) {
        isCounting = false
        if (counter > 0) {
          streaksArray.push(counter)
          counter = 0
        }
      }

      if (streaksArray?.length === 3) {
        break
      }

      if (i === allTrackedDates.length - 1 && isCounting) {
        streaksArray.push(counter)
      }
    }

    setLastThreeStreaks(streaksArray)
  }, [habit])


  return lastThreeStreaks

}