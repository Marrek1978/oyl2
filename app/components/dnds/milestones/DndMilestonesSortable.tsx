import { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';

import { Link } from "@remix-run/react";
import DndHoverDisplay from "./DndHoverDisplay";
import TextBtn from "~/components/buttons/TextBtn";
import { ArrowRight, EditIcon } from "~/components/utilities/icons";

import type { Milestone } from "@prisma/client";

interface MilestoneSortableProps {
  id: string;
  item: Milestone
  arrayLength: number;
  linkTitle?: string;
}


function DndMilestonesSortable({ id, item, linkTitle = 'Edit' }: MilestoneSortableProps) {

  const [isOpenMileStoneModal, setIsOpenMileStoneModal] = useState(false)
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  const handleMouseOver = () => {
    console.log('mouse over');
    const timer = setTimeout(() => {
      setIsOpenMileStoneModal(true);
    }, 1200); // 2000 milliseconds = 2 seconds
    setHoverTimer(timer);
  }


  const handleMouseOut = () => {
    setIsOpenMileStoneModal(false);
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
  }


  return (
    <>
      <div key={id} ref={setNodeRef} style={style} {...attributes} {...listeners} className="mt-0">
        <div id={id} className='
        relative
          my-4
          font-poppins
          cursor-pointer 
          text-left text-base-content
          transition duration-500
          hover:bg-primary/30 
          hover:text-primary-focus
          max-w-prose
          '
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          {isOpenMileStoneModal && (
            <DndHoverDisplay
              item={item} />
          )}
          <div>
            <div className=" flex">
              <div className="step step-primary font-semibold capitalize">{item?.title}</div>
            </div>

            <div className='text-xs'>Due Date</div><div> {item?.dueDate?.toString()}</div>

            <Link to={id}>
              <TextBtn
                text={linkTitle}
                icon={EditIcon}
              />
            </Link>
          </div>

        </div>
      </div>
      <div className="pt-4 ">  {ArrowRight} </div>
    </>
  )
}

export default DndMilestonesSortable