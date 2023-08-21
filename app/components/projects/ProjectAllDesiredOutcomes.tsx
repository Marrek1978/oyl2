import { useLoaderData } from '@remix-run/react'

import H1WithLink from '../titles/H1WithLink'
import ProjectOutcome from './ProjectOutcome'

import type { DesireOutcomeWithStringDates } from '~/types/outcomeTypes'


type Props = {}

function ProjectAllDesiredOutcomes({ }: Props) {

  const { outcomes } = useLoaderData()

  return (
    <>
      <div className='max-w-max'>
        <H1WithLink
          title={'Tasks to Reach Desired Outcomes'}
          linkDestination={`/dash/desires/${outcomes[0].desireId}/outcomes`}
          linkText='Go To Desire -> Outcomes'
        />
      </div>


      <div>
        {outcomes.map((desiredOutcome: DesireOutcomeWithStringDates) => {

          return (
            <>
              <div className='mt-20'>
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