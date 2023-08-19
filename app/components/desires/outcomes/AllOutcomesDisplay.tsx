
import H2WithLink from '../../titles/H2WithLink';
import SubHeading16px from '../../titles/SubHeading16px';
import BasicTextAreaBG from '../../baseContainers/BasicTextAreaBG';

import OutcomeDisplay from './OutcomeDisplay';

import type { OutcomeWithProgressList } from '~/types/outcomeTypes';

interface SpecificOutcomeDisplayProps {
  outcomes: OutcomeWithProgressList[];
  plural: string;
  title: string;
}


function AllOutcomesDisplay({ outcomes, plural, title }: SpecificOutcomeDisplayProps) {
  return (
    <>
      <div className=''>

        <BasicTextAreaBG >

          <div className='text-success mb-2'>
            <SubHeading16px text='Outcomes for Desire' />
          </div>

          {/* //?  THE TITLE SECTION  */}
          <H2WithLink
            title={`${title} Outcomes` || ''}
            linkDestination={'outcomes'}
            linkText={'Go To Outcomes'}
          />

          {/* //? DESCRIPTION AND LIST OF MILESTOONES */}
          <div className='mt-4'>
            {outcomes?.map((outcome: OutcomeWithProgressList) => {
              return (
                <OutcomeDisplay
                  key={outcome.id}
                  outcome={outcome}
                />
              )
            })}
          </div >

        </BasicTextAreaBG >
      </div>
    </>
  )
}

export default AllOutcomesDisplay