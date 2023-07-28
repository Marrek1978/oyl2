import { Link } from "@remix-run/react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';

import { EditIcon } from "../../utilities/icons";

import type { DesireWithValues } from '~/types/desireTypes'

interface DndSortableDesireProps {
  id: string;
  desire: DesireWithValues;
}

function DndSortableDesire({ id, desire }: DndSortableDesireProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const desireValues = desire.desireValues
  desireValues.sort((a, b) => a.value.sortOrder - b.value.sortOrder)

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="w-full">
      <div key={desire.id} id={desire.id} className='
       
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
          <div className='text-xl font-medium'>{desire.title}</div>
          {/* //!  add value-badges here */}
          <div className="flex flex-wrap gap-2 items-center w-full mt-2">
            {desireValues.map((value) => {
              const title = value.value.valueTitle
              let id = uuidv4();
              return (
                <div key={id} className="badge badge-xs badge-info gap-2 ">
                  {title}
                </div>
              )
            })
            }
          </div>
          <Link to={desire.id} >
            <div className='flex gap-2 items-center
                text-primary font-mont font-bold text-xs  uppercase
                 hover:scale-105 transition-all '>
              EDIT {EditIcon}
            </div>
          </Link>
        </div>
        <div className='
          text-slate-400 text-sm 
          mt-1 
          max-w-prose
          truncate 
          '>
          {desire.description}
        </div>


      </div>
    </div>
  );
}

export default DndSortableDesire