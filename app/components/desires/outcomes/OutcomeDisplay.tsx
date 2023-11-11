import Heading20px from '~/components/titles/Heading20px';

import type {  Outcome } from '@prisma/client';


interface OutcomeDisplayProps {
  outcome: Outcome;
}


function OutcomeDisplay({ outcome }: OutcomeDisplayProps) {


  return (
    <>
      <div key={outcome.id} className=' mt-2 max-w-max  min-w-[350px] sm:min-w-[400px]'>
        <div className=' text-base-content max-w-prose'>
          <Heading20px text={outcome.title} />
        </div>
      </div>
    </>
  )
}

export default OutcomeDisplay