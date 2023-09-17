import Heading20px from '~/components/titles/Heading20px';

import type { DesireOutcome } from '@prisma/client';


interface OutcomeDisplayProps {
  outcome: DesireOutcome;
}


function OutcomeDisplay({ outcome }: OutcomeDisplayProps) {


  return (
    <>
      <div key={outcome.id} className=' mt-2 max-w-max  min-w-[350px] sm:min-w-[400px]'>
        <div className=' text-base-content max-w-prose'>
          <Heading20px text={outcome.title} />
        </div>
        {/* <div className='max-h-12 overflow-hidden max-w-prose para-color '>{outcome.description}</div> */}
      </div>
    </>
  )
}

export default OutcomeDisplay