import { Link, Outlet,  useLoaderData } from '@remix-run/react';

import { requireUserId } from '~/models/session.server';
import { getDesireById } from '~/models/desires.server';
import { getProjectById } from '~/models/project.server';
import TextBtn from '~/components/buttons/TextBtn';
import HeadingH1 from '~/components/titles/HeadingH1';
import HeadingH2 from '~/components/titles/HeadingH2';
import { EditIcon } from '~/components/utilities/icons';
import SubHeading14px from '~/components/titles/SubHeading14px';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';

// import type { Desire, Project } from '@prisma/client';
import type { LoaderFunctionArgs, LoaderFunction } from '@remix-run/server-runtime';
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs';



export const loader: LoaderFunction = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const projectId = params.projectId!;   // const project = getProjectById(params.projectId, userId)
  try {
    const project = await getProjectById(projectId, userId);
    const desireId = project?.desireId
    let desire;
    if (desireId) {
      desire = await getDesireById(desireId, userId)
    }
    return { project, desire };
  } catch (error) { throw error }
};

function ManageProjectPage() {

  const {project, desire} = useLoaderData()
  const desireTitle = desire?.title || ''
  
  return (
    <>
      <BreadCrumbs  title={project.title}  />

      <Outlet />
      <div className='flex flex-col gap-6 max-w-max'>
        <article>
          <BasicTextAreaBG >
            <div className='flex justify-between items-baseline'>
              <div className='flex gap-4 items-baseline '>
                <HeadingH1 text={project.title} />
              </div>

              <Link to={`editDescription`} >
                <TextBtn
                  text='Edit Project Description'
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
            <p className='text-md mt-4 text-base-content font-poppins w-prose max-w-prose' >{project.description}</p>
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

export default ManageProjectPage