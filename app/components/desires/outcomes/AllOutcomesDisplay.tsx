import { Link } from '@remix-run/react';

import TextBtn from '~/components/buttons/TextBtn';
import HeadingH1 from '~/components/titles/HeadingH1';
import { EditIcon } from '~/components/utilities/icons';
import OutcomeDisplay from '~/components/desires/outcomes/OutcomeDisplay';

import type { DesireOutcome } from '@prisma/client';

interface SpecificOutcomeDisplayProps {
  outcomes: DesireOutcome[];
  plural: string;
  title: string;
}


function AllOutcomesDisplay({ outcomes, plural, title }: SpecificOutcomeDisplayProps) {
  return (
    <>
      {/* //?  THE TITLE SECTION  */}
      <div className='flex flex-wrap gap-x-12 items-baseline    '>

        <div className='mt-4'>
          <HeadingH1 text={'Outcomes of the Ideal Scenario'} />
        </div>

        <div className='max-w-max'>
          <Link to={'outcomes'}
            className=' justify-end self-baseline
            text-sm min-w-max  
          '>
            <TextBtn
              text={'Go To Outcomes'}
              onClickFunction={() => { }}
              icon={EditIcon}
            />
          </Link>
        </div>
      </div>

      {/* //? DESCRIPTION AND LIST OF MILESTOONES */}
      <div className='flex flex-wrap gap-x-6 gap-y-4 mt-4'>
        {outcomes?.map((outcome: DesireOutcome) => {
          return (
            <OutcomeDisplay
              key={outcome.id}
              outcome={outcome}
            />
          )
        })}
      </div >
    </>
  )
}

export default AllOutcomesDisplay