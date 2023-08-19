import { v4 as uuidv4 } from 'uuid';

import { formatDate } from '~/utils/functions';
import Heading16px from '~/components/titles/Heading16px';
import Heading14px from '~/components/titles/Heading14px';

import type { DesireOutcomeProgress } from '@prisma/client';
import type { OutcomeWithProgressList } from '~/types/outcomeTypes';


interface OutcomeDisplayProps {
  outcome: OutcomeWithProgressList;
}


function OutcomeDisplay({ outcome }: OutcomeDisplayProps) {

  const progressList = outcome.desireOutcomeProgress.map((progress: DesireOutcomeProgress) => {
    const id = uuidv4();

    return (
      <div key={id}>
        <div className={`
          mt-0 grid grid-cols-[auto_max-content] gap-4  items-baseline
          font-normal para-color 
          ${progress.complete && 'line-through text-base-300'}
          `} >
          <div className='max-w-[400px]'>
            {progress.title}
          </div>
          <div className='font-sm text-base-content/70'>
            {progress.dueDate && <div className='text-sm '>{formatDate(progress.dueDate)}</div>}
          </div>
        </div>
      </div>
    )
  })


  return (
    <>
      <div key={outcome.id} className=' mt-12'>
        <div className='flex justify-between text-base-content'>
          <Heading16px text={outcome.title} />
          <div className='text-sm text-success font-medium '>{formatDate(outcome.dueDate)}</div>
        </div>
        <div className='max-h-12 mr-8 overflow-hidden max-w-prose  para-color'>{outcome.description}S</div>

        <div className='text-base-content mt-4 font-semibold '>
          <Heading14px text={'Milestones'} />
        </div>
        <div>
          {progressList}
        </div>
      </div>
    </>
  )
}

export default OutcomeDisplay