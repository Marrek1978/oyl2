import { Link, Outlet, useLoaderData } from '@remix-run/react'
import type { LoaderArgs, ActionArgs } from '@remix-run/server-runtime'
import type { Desire } from '@prisma/client'

import TextBtn from '~/components/buttons/TextBtn'
import HeadingH1 from '~/components/titles/HeadingH1'
import HeadingH2 from '~/components/titles/HeadingH2'
import { EditIcon } from '~/components/utilities/icons'
import SubHeading14px from '~/components/titles/SubHeading14px'
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs'
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG'

import { getDesires } from '~/models/desires.server'
import { requireUserId } from '~/models/session.server'
import { getProjectById } from '~/models/project.server'

export const loader = async ({ request, params }: LoaderArgs) => {
  let userId = await requireUserId(request);
  const projectId = params.projectId!
  try {
    const desires = await getDesires(userId)
    const project = await getProjectById(projectId, userId)
    return { project, desires, userId }
  } catch (error) { throw error }
}

export const action = async ({ request }: ActionArgs) => {
  return null
}

//! add lists, routines, routine_tracker, and required_savings, associated to project.
// ! nested lists will be available to schedule, routines will be available to schedule,
// !  routine_tracker will not be available to schedule, required_savings will not be available to schedule
export default function ProjectByIdPage() {

  const { project, desires } = useLoaderData()
  const desireTitle = desires.find((desire: Desire) => desire.id === project.desireId)?.title

  return (
    <>
      <BreadCrumbs title={project.title || ''} />

      <Outlet />
      <div className='flex flex-col gap-6'>
        <article>
          <BasicTextAreaBG >
            <div className='flex justify-between items-baseline'>
              <div className='flex gap-4 items-baseline '>
                <HeadingH1 text={project.title} />
              </div>
              <Link to={'manage'} >
                <TextBtn
                  text='Manage Project'
                  onClickFunction={() => { }}
                  icon={EditIcon}
                />
              </Link>
            </div>
            {desireTitle && (
              <div className='mt-1 mb-2 text-base-content/50  '>
                <SubHeading14px
                  text={`To realize the desire: ${desireTitle}`}
                />
              </div>
            )}
            <p className='text-md mt-4 text-base-content font-poppins' >{project.description}</p>
          </BasicTextAreaBG >
        </article>

        <article>
          <BasicTextAreaBG >
            <div className='flex justify-between items-baseline'>
              <HeadingH2 text='MileStones' />
              <Link to={'milestones'} >
                <TextBtn
                  text='Go To Milestones'
                  onClickFunction={() => { }}
                  icon={EditIcon}
                />
              </Link>
            </div>
          </BasicTextAreaBG >
        </article>

        <article>
          <BasicTextAreaBG >
            <div className='flex justify-between items-baseline'>
              <HeadingH2 text='Habits Tracked' />
              <Link to={'milestones'} >
                <TextBtn
                  text='Go To Habits Tracked'
                  onClickFunction={() => { }}
                  icon={EditIcon}
                />
              </Link>
            </div>
          </BasicTextAreaBG >
        </article>

        <article>
          <BasicTextAreaBG >
            <div className='flex justify-between items-baseline'>
              <HeadingH2 text='Budgeting' />
              <Link to={'milestones'} >
                <TextBtn
                  text='Go To Budgeting'
                  onClickFunction={() => { }}
                  icon={EditIcon}
                />
              </Link>
            </div>

          </BasicTextAreaBG >
        </article>

        <article>
          <BasicTextAreaBG >
            <div className='flex justify-between items-baseline'>
              <HeadingH2 text='Lists' />
              <Link to={'edit'} >
                <TextBtn
                  text='Go To Lists'
                  onClickFunction={() => { }}
                  icon={EditIcon}
                />
              </Link>
            </div>
          </BasicTextAreaBG >
        </article>

        <article>
          <BasicTextAreaBG >
            <div className='flex justify-between items-baseline'>
              <HeadingH2 text='Habits/Routines' />
              <Link to={'edit'} >
                <TextBtn
                  text='Go To Habits/Routines'
                  onClickFunction={() => { }}
                  icon={EditIcon}
                />
              </Link>
            </div>
          </BasicTextAreaBG >
        </article>
      </div>

    </>
  )
}
