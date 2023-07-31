import { Link } from "@remix-run/react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';

import { EditIcon } from "../../utilities/icons";

import type { Value } from '@prisma/client';

interface DndSortableValueProps {
  id: string;
  value: Value;
}

function DndSortableValue({ id, value }: DndSortableValueProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mt-5">
      <div key={value.id} id={value.id} className='
        w-full
        px-3 py-4 
        mt-2
        font-poppins
        cursor-pointer 
        text-left text-base-content
        transition duration-500
        hover:bg-primary/30 
        hover:text-primary-focus
     '>
        <div className="flex items-center justify-between gap-4 ">
          <div className='text-xl font-medium'>{value.valueTitle}</div>
          <Link to={value.id} >
            <div className='flex gap-2 items-center
                text-primary font-mont font-bold text-xs  uppercase
                 hover:scale-105 transition-all '>
              EDIT {EditIcon}
            </div>
          </Link>
        </div>
        <div className='
          text-base-content/70
          text-sm 
          mt-2      
          max-w-prose w-prose
          '>
          {value.valueDescription}
        </div>
      </div>
    </div>
  );
}

export default DndSortableValue