import { Link, Outlet, useMatches, useParams } from '@remix-run/react'
import type { LoaderArgs, ActionArgs } from '@remix-run/server-runtime'

import TextBtn from '~/components/buttons/TextBtn'
import HeadingH1 from '~/components/titles/HeadingH1'
import { EditIcon } from '~/components/utilities/icons'
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG'

import type { Project, Desire } from '@prisma/client'
import HeadingH2 from '~/components/titles/HeadingH2'

export const loader = async ({ request }: LoaderArgs) => {

  //load project from params
  return null
}

export const action = async ({ request }: ActionArgs) => {
  return null
}

//! add lists, routines, routine_tracker, and required_savings, associated to project.
// ! nested lists will be available to schedule, routines will be available to schedule,
// !  routine_tracker will not be available to schedule, required_savings will not be available to schedule
export default function ProjectByIdPage() {

  const matches = useMatches();
  const params = useParams();
  const projects = matches.find(match => match.id === 'routes/dash.projects')?.data.projects
  const desires = matches.find(match => match.id === 'routes/dash.projects')?.data.desires
  const project = projects?.find((project: Project) => project.id === params.projectId)

  const desireTitle = desires.find((desire: Desire) => desire.id === project.desireId)?.title

  return (
    <>
      <Outlet />
      <div className='flex flex-col gap-6'>
        <article>
          <BasicTextAreaBG >
            <div className='flex justify-between items-baseline'>
              <div className='flex gap-4 items-baseline '>
                <HeadingH1 text={project.title} />
                {desireTitle && (
                  <div className="badge badge-sm badge-info gap-2 ">
                    {desireTitle}
                  </div>
                )}
              </div>
              <Link to={'edit'} >
                <TextBtn
                  text='Edit Project Description'
                  onClickFunction={() => { }}
                  icon={EditIcon}
                />
              </Link>
            </div>
            <p className='text-xl mt-4' >{project.description}</p>
          </BasicTextAreaBG >
        </article>

        <article>
          <BasicTextAreaBG >
            <div className='flex justify-between items-baseline'>
              <HeadingH2 text='Lists' />
              <Link to={'edit'} >
                <TextBtn
                  text='Edit Lists'
                  onClickFunction={() => { }}
                  icon={EditIcon}
                />
              </Link>
            </div>

            Milestones
            Lists
            Habits
            habit tracker
            required savings
          </BasicTextAreaBG >
        </article>
      </div>

    </>
  )
}
