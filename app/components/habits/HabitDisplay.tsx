import PageTitle from '../titles/PageTitle'
import HeadingH1 from '../titles/HeadingH1'

import type { HabitWithStreaks } from '~/types/habitTypes'
import HeadingH3 from '../titles/HeadingH3'
import HeadingH4 from '../titles/HeadingH4'

type Props = {
  habit: HabitWithStreaks
}

function HabitDisplay({ habit }: Props) {
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
        <div> Date  </div>
        <div> Date  </div>
        <div> Date  </div>
        <div> Date  </div>
        <div> Date  </div>
        <div> Date  </div>
        <div> Date  </div>
      </div>
    </>
  )
}

export default HabitDisplay