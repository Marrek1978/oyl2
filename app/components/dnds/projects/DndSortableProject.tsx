import { useSortable } from '@dnd-kit/sortable';
import React from 'react'
import { Link, useMatches } from "@remix-run/react";
import { CSS } from "@dnd-kit/utilities";

import { EditIcon } from "../../utilities/icons";
import type { Desire, Project } from '@prisma/client';

interface DndSortableProjectProps {
  id: string;
  project: Project
}


function DndSortableProject({ id, project }: DndSortableProjectProps) {

  const matches = useMatches();
  const allUserDesires: Desire[] = matches.find(match => match.id === 'routes/dash.projects')?.data.desires

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
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="max-w-max">
      <div key={project.id} id={project.id}
        className='
          max-w-max
          px-3 py-4 
          mt-2
          font-poppins
          cursor-pointer 
          text-left text-base-content
          transition duration-500
          hover:bg-primary/30 
          hover:text-primary-focus
      '>

        {/* <div className='flex items-center justify-between gap-12  '> */}
        <div className="flex items-center justify-between gap-4 ">
          <div className='text-xl font-medium'>{project.title}</div>
          <Link to={project.id} >
            <div className='flex gap-2 items-center 
              text-primary font-mont font-bold text-xs  uppercase
               hover:scale-105 transition-all '>
              Go to {EditIcon}
            </div>
          </Link>
        </div>
        <div className='
        text-slate-400 text-sm 
        mt-1 
        max-w-prose
        truncate 
        '>
          {project.description}
        </div>

        {/* //!  add value-badges here */}
        {associatedDesire && (
          <div className="flex flex-wrap gap-2 items-center w-full mt-2">
            <div key={id} className="badge badge-xs badge-info gap-2 ">
              {associatedDesire}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DndSortableProject