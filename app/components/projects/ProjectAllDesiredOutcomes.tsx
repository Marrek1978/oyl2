import { useLoaderData } from '@remix-run/react'

import H1WithLink from '../titles/H1WithLink'
import ProjectOutcome from './ProjectOutcome'
import SubHeading14px from '../titles/SubHeading14px'

import type { DesireOutcomeWithStringDates } from '~/types/outcomeTypes'


type Props = {}

function ProjectAllDesiredOutcomes({ }: Props) {

  const { outcomes } = useLoaderData()

  return (
    <>
      <div className='max-w-max mt-20'>
        <H1WithLink
          title={'Tasks to Reach Desired Outcomes'}
          linkDestination={`/dash/desires/${outcomes[0].desireId}/outcomes`}
          linkText='Go To Desire -> Outcomes'
        />
      </div>


      <div>
        {outcomes.map((desiredOutcome: DesireOutcomeWithStringDates) => {

          return (
            //?DND these???
            <>
              <div className='mt-12'>
                <div className='text-success'>
                  <SubHeading14px text='Desired Outcome' />
                </div>
                <ProjectOutcome
                  desiredOutcome={desiredOutcome}
                  key={desiredOutcome.id}
                />
              </div>
            </>
          )
        })}
      </div>
    </>
  )
}

export default ProjectAllDesiredOutcomes