import { useSortable } from '@dnd-kit/sortable';
import React from 'react'
import { Link, useMatches, useParams } from "@remix-run/react";
import { CSS } from "@dnd-kit/utilities";

import { EditIcon } from "../../utilities/icons";
import type { Desire, Project } from '@prisma/client';
import SubHeading12px from '~/components/titles/SubHeading12px';
import SubHeading14px from '~/components/titles/SubHeading14px';
import TextBtn from '~/components/buttons/TextBtn';

interface DndSortableProjectProps {
  id: string;
  project: Project
}


function DndSortableProject({ id, project }: DndSortableProjectProps) {

  const matches = useMatches();
  const allUserDesires: Desire[] = matches.find(match => match.id === 'routes/dash.projects')?.data.desires
  const params = useParams();
  const highlightedProjectId = params?.projectId as string

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  let associatedDesire;
  if (project?.desireId) {
    const associatedDesireId = project?.desireId
    associatedDesire = allUserDesires.filter(desire => desire.id === associatedDesireId)[0]?.title
  }



  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className=" ">
      <div key={project.id} id={project.id}
        className={`
          w-full
          px-3 py-4 
          mt-2
          font-poppins
          cursor-pointer 
          text-left text-base-content
          transition duration-500
          hover:bg-primary/30 
          hover:text-primary-focus
          ${project.sortOrder === 0 && 'bg-base-content text-base-100 hover:text-blue-500'}
          ${highlightedProjectId === project.id && project.sortOrder !== 0 && ' bg-info/70'}
      `}
      >

        {project.sortOrder === 0 && (
          <div className='font-medium mt-0 mb-2 text-sky-200  '>
            <SubHeading14px
              text='Project to focus on'
            />
          </div>
        )}
        {/* <div className='flex items-center justify-between gap-12  '> */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className={`
              text-xl font-medium 
              ${highlightedProjectId !== project.id && project.sortOrder !== 0 &&'text-base-content'}
              ${project.sortOrder === 0 && 'text-base-100'}
              ${highlightedProjectId === project.id && project.sortOrder !== 0 && 'text-primary-content'} 
            `} >
              {project.title}
            </div>

            {/* //!  add value-badges here */}
            {associatedDesire && (
              // <div className=" mt-0 text-gray-300">
              <div className={`
                text-xl font-medium 
                ${highlightedProjectId !== project.id && project.sortOrder !== 0 &&'text-slate-600'}
                ${project.sortOrder === 0 && 'text-base-300'}
                ${highlightedProjectId === project.id && project.sortOrder !== 0 && 'text-gray-200'} 
              `} >
                <SubHeading12px
                  text={associatedDesire}
                />
              </div>

            )}
          </div>

          <div className='self-start'>
            {highlightedProjectId !== project.id ?
              <Link to={project.id} >
                <TextBtn
                  text='Go To'
                  onClickFunction={() => { }}
                  color='red-600'
                  icon={EditIcon}
                />
              </Link>
              :
              <div >{EditIcon}</div>
            }
          </div>

        </div>

        <div className={`
          mt-2 w-prose max-w-prose
          text-slate-400 text-sm 
          ${highlightedProjectId !== project.id && project.sortOrder !== 0 &&'text-slate-500'}
          ${project.sortOrder === 0 && 'text-gray-300'}
          ${highlightedProjectId === project.id && project.sortOrder !== 0 && 'text-gray-200'} 
          `}>
          {project.description}
        </div>


      </div>
    </div>
  );
}

export default DndSortableProject