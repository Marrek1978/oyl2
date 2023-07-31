import { Link, useMatches, useParams } from "@remix-run/react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';

import TextBtn from '~/components/buttons/TextBtn';
import SubHeading12px from '~/components/titles/SubHeading12px';
import SubHeading14px from '~/components/titles/SubHeading14px';
import { ArrowUpperRight, EditIcon } from "../../utilities/icons";

import type { Desire, Project } from '@prisma/client';
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
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className=" mt-5">
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
          ${project.sortOrder === 0 && 'bg-base-content text-base-100   hover:bg-info-content '}
          ${highlightedProjectId === project.id && project.sortOrder !== 0 && ' bg-info/50'}
      `}
      >

        {project.sortOrder === 0 && (
          <div className='mt-0 mb-2 text-info/70  '>
            <SubHeading14px
              text='Project to focus on'
            />
          </div>
        )}
        {/* <div className='flex items-center justify-between gap-12  '> */}
        <div className="flex items-baseline justify-between gap-4">
          <div className={`
              text-xl font-medium 
              ${highlightedProjectId !== project.id && project.sortOrder !== 0 && 'text-base-content'}
              ${project.sortOrder === 0 && 'text-base-100'}
              ${highlightedProjectId === project.id && project.sortOrder !== 0 && 'text-success-content'} 
            `} >
            {project.title}
          </div>

          <div className=''>
            {highlightedProjectId !== project.id ?
              <Link to={project.id} >
                <TextBtn
                  text='Show Summary'
                  onClickFunction={() => { }}
                  color={`
                    ${project.sortOrder !== 0 && 'text-primary/70'}
                    ${project.sortOrder === 0 && 'text-info'}
                  `}
                  icon={EditIcon}
                />
              </Link>
              :
              <div className={` 
              ${project.sortOrder === 0 && 'text-info'}
              ${highlightedProjectId === project.id && project.sortOrder !== 0 && 'text-primary/70'} 
              `} >
                {ArrowUpperRight}
              </div>
            }
          </div>
        </div>

        {/* //!  add value-badges here */}
        {associatedDesire && (
          <div className={`
                font-medium 
                ${highlightedProjectId !== project.id && project.sortOrder !== 0 && 'text-slate-600'}
                ${project.sortOrder === 0 && 'text-base-300'}
                ${highlightedProjectId === project.id && project.sortOrder !== 0 && 'text-base-content'} 
              `} >
            <SubHeading12px
              text={associatedDesire}
            />
          </div>
        )}

        <div className={`
          mt-2 w-prose max-w-prose text-sm 
          ${highlightedProjectId !== project.id && project.sortOrder !== 0 && 'text-base-content/80'}
          ${project.sortOrder === 0 && 'text-base-300/70'}
          ${highlightedProjectId === project.id && project.sortOrder !== 0 && 'text-info-content/70'} 
          `}>
          {project.description}
        </div>

      </div>
    </div>
  );
}

export default DndSortableProject