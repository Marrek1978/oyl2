import React from 'react'
import { Link } from '@remix-run/react'
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';
import { EditIcon } from '~/components/utilities/icons'

interface basicTextAreaBGProps {
  children: React.ReactNode
  title: string;
  id: string;
  description: string;
  linkTitle?: string;
}

function DndSortableGeneric({ children, id, title, description, linkTitle = 'Edit' }: basicTextAreaBGProps) {

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


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
            <div className='text-xl font-medium'>{title}</div>
            <Link to={id} >
              <div className='flex gap-2 items-center
                text-primary font-mont font-bold text-xs  uppercase
                 hover:scale-105 transition-all '>
                {linkTitle} {EditIcon}
              </div>
            </Link>
          </div>

          {/* //! associations?? */}
          <div className=' '>  {children}</div>

          <div className='
            text-base-content/70
            text-sm 
            mt-2      
            max-w-prose w-prose
            '>
            {description}
          </div>
        </div>
      </div>
    </>
  )
}

export default DndSortableGeneric