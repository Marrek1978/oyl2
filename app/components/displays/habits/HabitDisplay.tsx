import { useEffect, useState } from 'react'

import DateDisplay from './DateDisplay'
import PageTitle from '../../headers/PageTitle'
import HeadingH3 from '../../headers/HeadingH3'
import HeadingH4 from '../../headers/HeadingH4'
import H1WithLink from '../../headers/H1WithLink'
import TextProseWidth from '../../text/TextProseWidth'

import type { HabitWithDates } from '~/types/habitTypes'
import type { HabitDate } from '@prisma/client'


type Props = {
  habit: HabitWithDates
  existingStreaks: HabitDate[]
}

function HabitDisplay({ habit, existingStreaks }: Props) {
  const streaks = useGetStreaks(habit?.habitDate)

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
        <H1WithLink title={habit?.title} linkDestination={'edit'} />
      </div>

      {habit?.description && (
        <div className="mt-2
        max-w-prose
        font-poppins
        text-left text-base-content
         ">
          <TextProseWidth text={habit?.description} />
        </div>
      )}

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


export const useGetStreaks = (streaks: HabitDate[]): number[] => {
  const [lastThreeStreaks, setLastThreeStreaks] = useState<number[]>([0])

  useEffect(() => {
    if (!streaks) return
    const streaksArray = findLastThreeStreaks(streaks)
    setLastThreeStreaks(streaksArray)
  }, [streaks])

  return lastThreeStreaks
}


export const findLastThreeStreaks = (streaks: HabitDate[]): number[] => {
  let counter = 0
  let isCounting = false
  const allTrackedDates: HabitDate[] = streaks
  let streaksArray: number[] = []

  for (let i = 0; i < allTrackedDates?.length; i++) {
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

  return streaksArray
}