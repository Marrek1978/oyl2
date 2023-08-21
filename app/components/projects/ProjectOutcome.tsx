
import SubHeading14px from '../titles/SubHeading14px';
import H2WithLinkAndProsePara from '~/components/text/H2WithLinkAndProsePara';

import type { DesireOutcomeWithStringDates } from '~/types/outcomeTypes';


type Props = {
  desiredOutcome: DesireOutcomeWithStringDates;
}

function ProjectOutcome({ desiredOutcome }: Props) {
  return (
    //display desiredOutcome title and description
    // due date  from outcome page
    // add project outcome, link to desiredOutcome data, date, inked lists, routines, $$, habits, and milestones.
    //consider how to add milestones, routines, lists, habits, and $$
    <>
      <div className=' mb-20 flex gap-8'>

        <div className='flex-1' >

          <H2WithLinkAndProsePara
            title={desiredOutcome.title}
            linkDestination={`/dash/desires/${desiredOutcome.desireId}/outcomes/${desiredOutcome.id}`}
            linkText='Go To Outcome Tasks'
            paragraph={desiredOutcome.description || ' '}
          />

          <div>
            <div className='mt-8'>
              <SubHeading14px text={'Milestones'} />
            </div>
            <div className='mt-6'>
              <ul className="steps">
                <li className="step step-primary">Register</li>
                <li className="step step-primary">Choose plan</li>
                <li className="step">Purchase</li>
                <li className="step">Receive Product</li>
              </ul>
            </div>
          </div>
        </div>

        <div className='flex-1' >
          <div className=' flex gap-4'>
            <div>
              <div>block 1</div>
            </div>
            <div>
              <div>block 2</div>
            </div>
            <div>
              <div>block 3</div>
            </div>

            <div>
              <div>block 4</div>
            </div>

          </div>
        </div>

      </div >
    </>
  )
}

export default ProjectOutcome