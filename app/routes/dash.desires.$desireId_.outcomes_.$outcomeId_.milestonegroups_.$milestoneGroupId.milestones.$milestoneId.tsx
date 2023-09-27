import { Outlet, useLoaderData, useMatches, useParams } from '@remix-run/react'
import React from 'react'
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG'
import MilestoneForm from '~/components/forms/milestones/MilestoneForm'
import { useGetAllMilestonesForGroup, useGetSpecificMilestone } from './dash.desires.$desireId_.outcomes_.$outcomeId_.milestonegroups_.$milestoneGroupId.milestones'
import Modal from '~/components/modals/Modal'

import type { LoaderArgs } from '@remix-run/server-runtime';
import { getMilestoneById } from '~/models/milestone.server'


export const loader = async ({ request, params }: LoaderArgs) => {

  const milestoneId = params.milestoneId;
  if(!milestoneId) throw new Error('No milestoneId was provided')

  try {
    const milestone = await getMilestoneById(milestoneId);
    return { milestone }
  } catch (error) { throw error }

}

type Props = {}

function IndividualMilestonePage({ }: Props) {


  const loaderData = useLoaderData();
  console.log('loaderData', loaderData)

  return (
    <>
      <Outlet />
      <Modal onClose={() => { }} zIndex={10}>
        <div className="flex flex-wrap w-full   ">

          <section className='flex-1 max-w-[600px]  '>
            <div className={`w-full min-w-[350px]`} >
              <BasicTextAreaBG pageTitle='Milestone' >
                <article>
                  <div className='mt-4'>
                    {/* <HeadingH1 text={title || ''} /> */}
                  </div>

                </article>
              </BasicTextAreaBG>
            </div >
          </section>

          <section className='flex-1 '>
            {/* <MilestoneForm /> */}
          </section>
        </div>
      </Modal>
    </>
  )
}

export default IndividualMilestonePage


 
// export const useGetSpecificMilestone = (milestoneId: string): Milestone[] | undefined => {
//   const milestonesArray = useGetAllMilestonesForGroup()

//   console.log('back in useGetSpecificMilestone')
//   console.log('milestonesArray is, ', milestonesArray)
//   const milestone = milestonesArray?.filter(milestone => milestone.id === milestoneId);
//   console.log('milestone is, ', milestone)
//   return milestone;
// }
