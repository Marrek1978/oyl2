import { Link } from '@remix-run/react'

import HeadingH1 from '../titles/HeadingH1'
import H2WithLink from '../titles/H2WithLink'
import SubHeading14px from '../titles/SubHeading14px'
import SubHeading16px from '../titles/SubHeading16px'
import BasicTextAreaBG from '../baseContainers/BasicTextAreaBG'
import H2WithLinkAndProsePara from '../text/H2WithLinkAndProsePara'
import { DesireIdealPlaceholderText } from '../utilities/PlaceHolderTexts'

import TodoLists from '../list/TodoLists'
import AllRoutines from '../routines/AllRoutines'

import type { ListAndToDos } from "~/types/listTypes";
import type { RoutineAndToDos } from '~/types/routineTypes'
import type { DesireWithStringDates } from '~/types/desireTypes'
import type { DesireOutcomeWithStringDates } from '~/types/outcomeTypes'



type Props = {
  desire: DesireWithStringDates
  outcome: DesireOutcomeWithStringDates
  outcomeLists: ListAndToDos[]
  outcomeRoutines: RoutineAndToDos[]
}

function ProjectTasksForOutcome({ desire, outcome, outcomeLists, outcomeRoutines }: Props) {
  return (
    <>
      <BasicTextAreaBG >
        <div className='text-success mb-2'>
          <SubHeading16px text='Project Tasks for Specific Outcome' />
        </div>
        {/* //?  THE TITLE SECTION  */}
        <HeadingH1 text={outcome.title || ''} />
        <div className="mt-2 text-secondary/70">
          <SubHeading14px
            text={`Desire  ->  Desired Outcomes  ->  Project  ->  Tasks`}
          />
        </div>
        <div className="para-color">
          <SubHeading14px
            text={`To achieve your Desire for : ` + desire.title}
          />
        </div>

        <div className='flex flex-wrap gap-12 w-full '>

          {/* //*  Grouped together  */}
          <div className='flex-1'>
            <div className='text-base-content'>
              {/* //?  THE DESIRE  */}
              <div className='mt-8 '>
                <H2WithLinkAndProsePara
                  title={`Desired Outcome`}
                  paragraph={desire?.description || ''}
                  linkDestination={`/dash/desires/${desire.id}/outcomes/${outcome.id}`}
                  linkText={`Edit Desire Outcome `}
                />
              </div>
            </div>

            <div id='links' className='mt-8'>
              <ul>
                <li> <Link to='..'>GoTo Milestones</Link></li>
                <li> <Link to='..'>GoTo Habit Trackers</Link></li>
                <li><Link to='..'>GoTo Money Trackers</Link></li>
                <li> <Link to='..'>GoTo Lists and Routines</Link></li>
              </ul>
            </div>
          </div>

          <div className=' mt-8 flex-1 '>
            <H2WithLinkAndProsePara
              title={'The Ideal Scenario'}
              linkDestination={`/dash/desires/${desire.id}/editIdeal`}
              linkText={'Edit Ideal Scenario'}
              paragraph={desire.ideal?.length ? desire.ideal : DesireIdealPlaceholderText}
            />
          </div>
        </div>



        <div>

          <div className='mt-20 max-w-max'>
            <H2WithLink
              title={'Milestones'}
              linkDestination={''}
              linkText={'Go To Milestones'}
            />
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

        <div>
          <div className='mt-20 max-w-max'>
            <H2WithLink
              title={'Habit Trackers'}
              linkDestination={''}
              linkText={'Go To Habits'}
            />
          </div>
          <div className='mt-6'>
            <div className="stats  bg-base-300 stats-vertical lg:stats-horizontal shadow">

              <div className="stat">
                <div className="stat-title">Downloads</div>
                <div className="stat-value">31K</div>
                <div className="stat-desc">Jan 1st - Feb 1st</div>
              </div>

              <div className="stat">
                <div className="stat-title">New Users</div>
                <div className="stat-value">4,200</div>
                <div className="stat-desc">↗︎ 400 (22%)</div>
              </div>

              <div className="stat">
                <div className="stat-title">New Registers</div>
                <div className="stat-value">1,200</div>
                <div className="stat-desc">↘︎ 90 (14%)</div>
              </div>

            </div>
          </div>
        </div>


        <div>
          <div className='mt-20 max-w-max'>
            <H2WithLink
              title={'Money Required'}
              linkDestination={''}
              linkText={'Go To Habits'}
            />
          </div>
          <div className='mt-6'>
            <div className="stats   stats-vertical lg:stats-horizontal shadow">

              <div className="stat">
                <div className="stat-title">Downloads</div>
                <div className="stat-value">$31K</div>
                <div className="stat-desc">Jan 1st - Feb 1st</div>
              </div>

              <div className="stat">
                <div className="stat-title">New Users</div>
                <div className="stat-value">$4,200</div>
                <div className="stat-desc">↗︎ 400 (22%)</div>
              </div>

              <div className="stat">
                <div className="stat-title">New Registers</div>
                <div className="stat-value">$1,200</div>
                <div className="stat-desc">↘︎ 90 (14%)</div>
              </div>

            </div>
          </div>
        </div>


        <div className='mt-20 w-full'>
          <AllRoutines
            routines={outcomeRoutines}
            headingSize='H2'
            linkText='routines/new'
          />
        </div>



        <div className='mt-20 w-full'>
          <TodoLists
            lists={outcomeLists}
            headingSize='H2'
            linkText='lists/new'
          />
        </div>

      </BasicTextAreaBG >

    </>
  )
}

export default ProjectTasksForOutcome