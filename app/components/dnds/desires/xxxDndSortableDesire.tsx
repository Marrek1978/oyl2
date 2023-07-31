import { Link } from "@remix-run/react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';

import { EditIcon } from "../../utilities/icons";

import type { DesireWithValues } from '~/types/desireTypes'
import SubHeading12px from "~/components/titles/SubHeading12px";

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
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mt-5">
      <div key={desire.id} id={desire.id} className='
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

        {/* <div className='flex items-center justify-between gap-12  '> */}
        <div className="flex items-center justify-between gap-4 ">
          <div className='text-xl font-medium'>{desire.title}</div>

          <Link to={desire.id} >
            <div className='flex gap-2 items-center
                text-primary font-mont font-bold text-xs  uppercase
                 hover:scale-105 transition-all '>
              EDIT {EditIcon}
            </div>
          </Link>
        </div>

        {/* //!  add value-badges here */}
        <div className="flex flex-wrap gap-2 items-center w-full mt-0">
          {desireValues.map((value) => {
            const title = value.value.valueTitle
            let id = uuidv4();
            return (
              <div key={id}
                className={`
                   font-medium 
                  text-slate-600
                `} >
                <SubHeading12px
                  text={`${title}, `}
                />
              </div>
            )
          })
          }
        </div>


        <div className='
         text-info-content/70
         text-sm 
          mt-2 
          max-w-prose w-prose
          '>
          {desire.description}
        </div>


      </div>
    </div>
  );
}

export default DndSortableDesire