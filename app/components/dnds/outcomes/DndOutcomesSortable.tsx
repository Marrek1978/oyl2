import React from 'react'
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';
import H2WithLink from '~/components/titles/H2WithLink';
import Heading16px from '~/components/titles/Heading16px';

import type { OutcomeWithProgressList } from '~/types/outcomeTypes';

interface SortableProps {
  children: React.ReactNode
  id: string;
  outcome: OutcomeWithProgressList;
}


function DndOutcomesSortable({ children, id, outcome }: SortableProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });


  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const title = outcome.title;
  const description = outcome.description || '';
  const linkTitle = 'Edit';


  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mt-0">
        <div key={id} id={id} className='
          px-3 py-4 
          mt-2
          max-w-max
          font-poppins text-left  para-color
          cursor-pointer 
          transition duration-500
          hover:bg-primary/30 
          hover:text-primary-focus
        '>
          <div className="flex items-center justify-between gap-4 text-base-content ">
            <H2WithLink
              title={title}
              linkDestination={id}
              linkText={linkTitle}
              date={outcome.dueDate}
            />
          </div>

          <div className='
            para-color
            text-sm 
            mt-0    
            mr-8
            max-w-prose w-prose
            max-h-10 overflow-hidden
            '>
            {description}
          </div>

          <div className='text-base-content mt-4 font-semibold '>
            <Heading16px text={'Milestones'} />
          </div>
          {children}
        </div>
      </div>
    </>
  )
}

export default DndOutcomesSortable