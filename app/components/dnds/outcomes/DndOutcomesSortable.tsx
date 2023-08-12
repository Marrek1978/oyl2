import React from 'react'
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';
import H2WithLink from '~/components/titles/H2WithLink';
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
          font-poppins
          cursor-pointer 
          text-left text-base-content
          transition duration-500
          hover:bg-primary/30 
          hover:text-primary-focus
          max-w-prose
        '>
          <div className="flex items-center justify-between gap-4 ">
            <H2WithLink
              title={title}
              linkDestination={id}
              linkText={linkTitle}
              date={outcome.dueDate}
            />
          </div>

          <div className='
            text-base-content/70
            text-sm 
            mt-0      
            max-w-prose w-prose
            max-h-10 overflow-hidden
            '>
            {description}
          </div>

          <div className='
            mt-4
            capitalize
          '>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default DndOutcomesSortable