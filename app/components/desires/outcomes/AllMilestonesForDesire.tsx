import { formatDate } from '~/utils/functions';
import HeadingH2 from '~/components/titles/HeadingH2';
import Heading14px from '~/components/titles/Heading14px';
import SubHeading16px from '~/components/titles/SubHeading16px';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';

import type { DesireOutcomeProgress } from '@prisma/client';
import type { OutcomeWithProgressList } from '~/types/outcomeTypes';


interface AllMilestonesForDesireProps {
  outcomes: OutcomeWithProgressList[];
  title: string;
}

type MileStoneWithOutcomeTitle = DesireOutcomeProgress & { outcome: string }


function AllMilestonesForDesire({ outcomes, title }: AllMilestonesForDesireProps) {
  const progressList: MileStoneWithOutcomeTitle[] = outcomes.map((outcome: OutcomeWithProgressList) => {
    return outcome.desireOutcomeProgress.map((progress: DesireOutcomeProgress) => {
      return ({
        ...progress,
        outcome: outcome.title
      })
    })
  }).flat()

  progressList.sort((a, b) => {
    const aTime = a.dueDate?.getTime();
    const bTime = b.dueDate?.getTime();
    if (aTime && bTime) {
      return aTime - bTime;
    } else if (aTime) {
      return -1;
    } else if (bTime) {
      return 1;
    } else {
      return 0;
    }
  });

  console.log(progressList)


  return (
    <>
      <div className='max-w-max flex-1 '>

        <BasicTextAreaBG >

          <div className='text-success mb-2'>
            <SubHeading16px text='All Milestones' />
          </div>
          <HeadingH2
            text={`${title} Milestones` || ''}
          />

          {/* //? DESCRIPTION AND LIST OF MILESTOONES */}
          <div className='mt-4'>
            {progressList?.map((milestone: MileStoneWithOutcomeTitle) => {
              return (
                <>
                  <div key={milestone.id}>
                    <div className='grid grid-cols-[auto_max-content_max-content] gap-4  items-baseline '>
                      <div className='max-w-sm '>{milestone.title}</div>
                      <div className='  '>{milestone.dueDate && formatDate(milestone.dueDate)}</div>
                      <div className='text-secondary  truncate font-sm '><Heading14px text={milestone.outcome} /></div>
                    </div>
                  </div>
                </>
              )
            })}
          </div >

        </BasicTextAreaBG >
      </div>
    </>
  )
}

export default AllMilestonesForDesire