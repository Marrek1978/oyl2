import PageTitle from '../titles/PageTitle'
import HeadingH1 from '../titles/HeadingH1'
import HeadingH3 from '../titles/HeadingH3'
import HeadingH4 from '../titles/HeadingH4'

import type  { Streak } from '@prisma/client'
import type { HabitWithStreaks } from '~/types/habitTypes'


type Props = {
  habit: HabitWithStreaks
  existingStreaks:Streak[]
}

function HabitDisplay({ habit, existingStreaks}: Props) {
console.log("🚀 ~ file: HabitDisplay.tsx:16 ~ HabitDisplay ~ existingStreaks:", existingStreaks)


  // setup streaks, count positive in a row
  //display as green check or red x




  return (
    <>
      <PageTitle text={'Habit'} />
      <div className='mt-2  '>
        <HeadingH1 H1Title={habit?.title} />
      </div>
      <div className='mt-6  '>
        <HeadingH3 text={`Current Streak ${habit?.description || ''}`} />
        <HeadingH4 text={`Last 3 Streaks ${habit?.description || ''}`} />
      </div>
      <div className='mt-6  '>
       { existingStreaks && existingStreaks?.map((streak, index) => {

        return (streak?.date?.toDateString())

       })}

      </div>
    </>
  )
}

export default HabitDisplay