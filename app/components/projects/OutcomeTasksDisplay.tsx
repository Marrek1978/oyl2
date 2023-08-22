import React from 'react'
import BasicTextAreaBG from '../baseContainers/BasicTextAreaBG'
import SubHeading16px from '../titles/SubHeading16px'
import HeadingH1 from '../titles/HeadingH1'
import SubHeading14px from '../titles/SubHeading14px'
import TextProseWidth from '../text/TextProseWidth'
import { Link } from '@remix-run/react'
import type { DesireWithStringDates } from '~/types/desireTypes'
import type { DesireOutcomeWithStringDates } from '~/types/outcomeTypes'
import type { ProjectWithStringDates } from '~/types/projectTypes'
import H2WithLinkAndProsePara from '../text/H2WithLinkAndProsePara'
import { DesireIdealPlaceholderText } from '../utilities/PlaceHolderTexts'
import H2WithLink from '../titles/H2WithLink'

type Props = {
  project: ProjectWithStringDates
  desire: DesireWithStringDates
  outcome: DesireOutcomeWithStringDates
}

function OutcomeTasksDisplay({ project, desire, outcome }: Props) {
  return (
    <>

      <BasicTextAreaBG >
        <div className='text-success mb-2'>
          <SubHeading16px text='Project Tasks for Specific Outcome' />
        </div>
        {/* //?  THE TITLE SECTION  */}
        <HeadingH1 text={outcome.title || ''} />

        <div className=" flex flex-wrap mt-2 text-secondary/70">
          <SubHeading14px
            text={`Desire  -> Project  ->  Outcome  ->  Outcome Tasks`}
          />
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
                <TextProseWidth text={outcome.description || ''} />
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
              linkDestination={'editIdeal'}
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

        <div>
          <div className='mt-20 max-w-max'>
            <H2WithLink
              title={' Routines'}
              linkDestination={''}
              linkText={'Go To Routines'}
            />
          </div>
          <div className='mt-6'>
            <div className="stats   stats-vertical lg:stats-horizontal shadow">

              <div className="card w-96 bg-base-100 shadow-xl image-full">
                <figure><img src="/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
                <div className="card-body">
                  <h2 className="card-title">Shoes!</h2>
                  <p>If a dog chews shoes whose shoes does he choose?</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                  </div>
                </div>
              </div>

              <div className="card w-96 bg-base-100 shadow-xl image-full">
                <figure><img src="/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
                <div className="card-body">
                  <h2 className="card-title">Shoes!</h2>
                  <p>If a dog chews shoes whose shoes does he choose?</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                  </div>
                </div>
              </div>

              <div className="card w-96 bg-base-100 shadow-xl image-full">
                <figure><img src="/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
                <div className="card-body">
                  <h2 className="card-title">Shoes!</h2>
                  <p>If a dog chews shoes whose shoes does he choose?</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>


        <div>
          <div className='mt-20 max-w-max'>
            <H2WithLink
              title={' To-Do Lists'}
              linkDestination={''}
              linkText={'Go To To-Do Lists'}
            />
          </div>
          <div className='mt-6'>
            <div className="stats   stats-vertical lg:stats-horizontal shadow">

              <div className="card w-96 bg-base-100 shadow-xl image-full">
                <figure><img src="/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
                <div className="card-body">
                  <h2 className="card-title">Shoes!</h2>
                  <p>If a dog chews shoes whose shoes does he choose?</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                  </div>
                </div>
              </div>

              <div className="card w-96 bg-base-100 shadow-xl image-full">
                <figure><img src="/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
                <div className="card-body">
                  <h2 className="card-title">Shoes!</h2>
                  <p>If a dog chews shoes whose shoes does he choose?</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                  </div>
                </div>
              </div>

              <div className="card w-96 bg-base-100 shadow-xl image-full">
                <figure><img src="/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
                <div className="card-body">
                  <h2 className="card-title">Shoes!</h2>
                  <p>If a dog chews shoes whose shoes does he choose?</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>


      </BasicTextAreaBG >

    </>
  )
}

export default OutcomeTasksDisplay