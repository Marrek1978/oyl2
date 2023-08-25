
import SubHeading14px from '../titles/SubHeading14px';
import H2WithLinkAndProsePara from '~/components/text/H2WithLinkAndProsePara';

import HeadingH3 from '../titles/HeadingH3';
import type { DesireOutcomeWithStringDates } from '~/types/outcomeTypes';


type Props = {
  desiredOutcome: DesireOutcomeWithStringDates;
}

function ProjectSpecficOutcome({ desiredOutcome }: Props) {
  return (
     <>
      <div className=' mb-20 flex gap-8'>

        <div className='flex-1' >

          <H2WithLinkAndProsePara
            title={desiredOutcome.title}
            linkDestination={`${desiredOutcome.id}`}
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
          <HeadingH3 text={`Tasks to Achieve the Outcome: ${desiredOutcome.title}`} />
        <SubHeading14px text={'Habits, Tasks, and Trackers'} />

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

export default ProjectSpecficOutcome