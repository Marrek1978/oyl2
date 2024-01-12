import { Link } from '@remix-run/react'
import { findLastThreeStreaks } from './HabitDisplay'

import type { HabitWithDates } from '~/types/habitTypes'


type Props = {
  habits: HabitWithDates[]
}

function HabitBadges({ habits }: Props) {

  // const pendingClass = 'shadow-2xl shadow-primary'
  const pendingClass = 'bg-warning'
  const sortedHabits = habits?.sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <>
      <div className=' flex gap-12 flex-wrap mt-4'>

        {sortedHabits?.map((habit) => {
          const lastThreeStreaks = findLastThreeStreaks(habit.habitDate)
          const currentStreak = lastThreeStreaks[0] || null
          const secondStreak = lastThreeStreaks[1] || null
          const thirdStreak = lastThreeStreaks[2] || null

          const today = new Date()
          const streaks = habit.habitDate


          let mostRecentDateTracked
          if (streaks?.length > 0) {
            mostRecentDateTracked = streaks.reduce((latest, current) => {
              return current.date > latest ? current.date : latest
            }, streaks[0].date)
          } else {
            mostRecentDateTracked = habit.startDate
          }

          const numDaysSinceLastTracked = Math.floor((today.getTime() - new Date(mostRecentDateTracked).getTime()) / (1000 * 3600 * 24))
          let daysPending = 0
          let isDaysPending = false

          if (numDaysSinceLastTracked > 0) {
            daysPending = numDaysSinceLastTracked
            isDaysPending = true
          }

          const isNewHabit = habit.startDate.toLocaleDateString('en-CA') === today.toLocaleDateString('en-CA')

          return (
            <div key={habit.id} className={`
              ${isDaysPending && pendingClass}
               h-min max-w-max p-4 
               text-base-content
               hover:cursor-pointer hover:bg-primary `}>

              <Link to={`habits/${habit.id}`}>
                <div className='text-xl font-bold text-base-content/70'>{habit.title}</div>
                <div className='flex gap-1  items-start'>
                  <div className='text-5xl'>
                    {currentStreak && currentStreak}
                  </div>

                  {!isNewHabit ? (

                    <div>
                      <div className='text-base font-semibold'>Days</div>
                      <div className='text-base-content/60 self-end'>{secondStreak}  {thirdStreak} </div>
                    </div>
                  ) : (
                    <div>
                      <div className='text-base font-semibold text-wrap'>A brand new Habit. </div>
                    </div>

                  )}

                </div>
                {daysPending > 0 && (
                  <div className='text-base-content/70 text-sm mt-4'>
                    {daysPending} Days Not Tracked
                  </div>
                )}
              </Link>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default HabitBadges