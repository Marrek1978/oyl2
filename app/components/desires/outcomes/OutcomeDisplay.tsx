// import { v4 as uuidv4 } from 'uuid';

import Heading16px from '~/components/titles/Heading16px';

import type { DesireOutcome } from '@prisma/client';


interface OutcomeDisplayProps {
  outcome: DesireOutcome;
}


function OutcomeDisplay({ outcome }: OutcomeDisplayProps) {


  return (
    <>
      <div key={outcome.id} className=' mt-12 max-w-max'>
        <div className='flex justify-between text-base-content '>
          <Heading16px text={outcome.title} />
        </div>
        <div className='max-h-12  overflow-hidden max-w-prose para-color mr-8'>{outcome.description}S</div>
      </div>
    </>
  )
}

export default OutcomeDisplay