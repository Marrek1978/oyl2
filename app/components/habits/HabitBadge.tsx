
import { Link } from '@remix-run/react'
import { findLastThreeStreaks } from './HabitDisplay'

import type { HabitWithStreaks } from '~/types/habitTypes'


type Props = {
  habits: HabitWithStreaks[]
}

function HabitBadge({ habits }: Props) {

// i need 2 classes

//1 for hover
// 1 for days pending

  return (
    <>
      <div className=' flex gap-12 flex-wrap mt-4'>

        {habits?.map((habit) => {
          console.log("🚀 ~ file: HabitBadge.tsx:15 ~ {habits?.map ~ habit:", habit)

          const lastThreeStreaks = findLastThreeStreaks(habit.streak)
          console.log("🚀 ~ file: HabitBadge.tsx:21 ~ {habits?.map ~ lastThreeStreaks:", lastThreeStreaks)

          const currentStreak = lastThreeStreaks[0] || null
          const secondStreak = lastThreeStreaks[1] || null
          const thirdStreak = lastThreeStreaks[2] || null

          return (
            <div key={habit.id} className=' max-w-max'>
              <Link to={`/dash`}>
                <div className='text-xl font-bold text-base-content/70'>{habit.title}L</div>
                <div className='flex gap-2'>
                  <div className='text-5xl'>
                    {currentStreak && currentStreak}
                  </div>

                  <div>
                    <div className='text-base font-semibold'>Days</div>
                    <div className='text-base-content/60 '>{secondStreak}  {thirdStreak} </div>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default HabitBadge