
import H2WithLink from '~/components/titles/H2WithLink';
import SubHeading16px from '~/components/titles/SubHeading16px';
import OutcomeDisplay from '~/components/desires/outcomes/OutcomeDisplay';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';

import type { DesireOutcome } from '@prisma/client';

interface SpecificOutcomeDisplayProps {
  outcomes: DesireOutcome[];
  plural: string;
  title: string;
}


function AllOutcomesDisplay({ outcomes, plural, title }: SpecificOutcomeDisplayProps) {
  return (
    <>
      <div className=''>

        {/* <BasicTextAreaBG > */}
          <div className='text-success mb-2'>
            <SubHeading16px text='Outcomes of Reaching the Ideal Situation' />
          </div>

          <div className='max-w-max '>

            {/* //?  THE TITLE SECTION  */}
            <H2WithLink
              title={`${title} Outcomes` || ''}
              linkDestination={'outcomes'}
              linkText={'Go To Outcomes'}
            />
          </div>

          {/* //? DESCRIPTION AND LIST OF MILESTOONES */}
          <div className='mt-4'>
            {outcomes?.map((outcome: DesireOutcome) => {
              return (
                <OutcomeDisplay
                  key={outcome.id}
                  outcome={outcome}
                />
              )
            })}
          </div >

        {/* </BasicTextAreaBG > */}
      </div>
    </>
  )
}

export default AllOutcomesDisplay