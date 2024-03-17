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
      <div className=' flex gap-4 flex-wrap mt-4'>

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

          const lgColorClass = isDaysPending ? ' night-lg-text winter-lg-text' : 'text-base-content/60'
          const numberColorClass = isDaysPending ? 'text-gray-700' : 'text-base-content'
          const smTextColorClass = isDaysPending ? ' night-sm-text winter-sm-text' : 'text-base-content/70'



          //!   need 3 color themes for the badges  light, dark, warning light/warning dark.
          return (
            <div key={habit.id} className={`
              ${isDaysPending && pendingClass}
               h-min max-w-max px-5 py-3
               text-base-content
               hover:cursor-pointer hover:bg-orange-300 `}>

              <Link to={`habits/${habit.id}`}>
                <div className={`text-xl font-semibold font-poppins leading-none capitalize ${lgColorClass}`}>{habit.title}</div>

                {isNewHabit ? (
                  <div>
                    <div className={`text-base font-semibold text-wrap ${numberColorClass} `}>A brand new Habit. </div>
                  </div>
                ) : (
                  <div className='flex gap-1 items-start mt-1'>
                    <div className={`text-5xl font-roboto font-base ${numberColorClass}`}>89  {currentStreak && currentStreak}</div>
                    <div>
                      <div className={`text-base font-poppins font-medium leading-none mt-1 ${numberColorClass} `}>Days</div>
                      <div className={` ${smTextColorClass} self-end`}>42 17 {secondStreak}  {thirdStreak} </div>
                    </div>
                  </div>
                )}

                {daysPending > 0 && (
                  <div className={` ${smTextColorClass} text-sm`}>
                    {daysPending} Days Not Tracked
                  </div>
                )}


              </Link>
            </div>
          )
        })}
      </div >
    </>
  )
}

export default HabitBadges