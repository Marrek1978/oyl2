import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';
import { Link, useMatches, useParams } from "@remix-run/react";

import { EditIcon } from "../../utilities/icons";
import TextBtn from '~/components/buttons/TextBtn';
import SubHeading12px from '~/components/titles/SubHeading12px';
import SubHeading14px from '~/components/titles/SubHeading14px';

import type { Desire, Project } from '@prisma/client';
import { GetSpecialLinkColor } from "~/components/forms/GetHeaderBgColor";
import HeadingH2 from "~/components/titles/HeadingH2";
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


  const linkColor = GetSpecialLinkColor();

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
          ${project.sortOrder === 0 ? `bg-success/90  text-success-content hover:bg-primary/70` : 'hover:bg-primary/30 '}
        }
      `}
      >

        {project.sortOrder === 0 && (
          <div className='mt-0 mb-2 text-base-200  '>
            <SubHeading14px
              text='Project to focus on'
            />
          </div>
        )}

        <div className="flex items-baseline justify-between gap-4 w-prose max-w-prose">
          <div className={`flex-1
              ${highlightedProjectId !== project.id && project.sortOrder !== 0 && 'text-base-content'}
              ${project.sortOrder === 0 && ' text-success-content'}
            `} >
            <HeadingH2 text={project.title} />
          </div>

          <div className=' '>
            <Link to={project.id} >
              <TextBtn
                text='Go To Project'
                onClickFunction={() => { }}
                color={` ${project.sortOrder !== 0 && 'text-primary/70'}
                    ${project.sortOrder === 0 && linkColor} `}
                icon={EditIcon}
              />
            </Link>
          </div>
        </div>

        {associatedDesire && (
          <div className="grid grid-cols-[90px_1fr] gap-x-2 gap-y-0 mt-2 items-start w-prose max-w-prose ">
            <div className='text-base-content/70 font-medium'>
              <SubHeading12px text={`For Desire:`} />
            </div>
            <div className=' font-semibold'>
              <SubHeading12px text={associatedDesire} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DndSortableProject