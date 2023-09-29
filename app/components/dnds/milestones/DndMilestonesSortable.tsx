
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';

import TextBtn from "~/components/buttons/TextBtn";
import { Link, useFetcher } from "@remix-run/react";
import { ArrowRight, EditIcon } from "~/components/utilities/icons";

import type { Milestone } from "@prisma/client";
import { formatDateDayDate } from '~/utils/functions';
import DndHoverDisplay from "./DndHoverDisplay";
import { useEffect, useState } from "react";

interface MilestoneSortableProps {
  id: string;
  passedMilestone: Milestone
  arrayLength: number;
  linkTitle?: string;
  index: number
  isLastItem: boolean
}


function DndMilestonesSortable({ id, passedMilestone, linkTitle = 'Edit', index, isLastItem }: MilestoneSortableProps) {

  const fetcher = useFetcher();
  const [isShowInfo, setIsShowInfo] = useState(false)
  const [isMouseOverModal, setIsMouseOverModal] = useState<boolean>(false);
  const [isMouseOverHoverable, setIsMouseOverHoverable] = useState<boolean>(false);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  const handleCompleteClicked = (passedMilestone: Milestone) => {
    const milestone = {
      ...passedMilestone,
      isComplete: !passedMilestone.isComplete,
      completedAt: passedMilestone.isComplete ? null : new Date()
    }
    const complete = {
      milestone,
      actionType: 'complete'
    }
    const submitedString = JSON.stringify(complete)
    try {
      fetcher.submit({
        submitedString
      }, {
        method: 'PUT',
      })
    } catch (error) { throw error }
  }


  const onClickHandler = (milestone: Milestone) => {
    handleCompleteClicked(milestone)
  }


  useEffect(() => {
    if (isMouseOverHoverable || isMouseOverModal) {
      const timeout = setTimeout(() => {
        setIsShowInfo(true)
      }, 800)
      return () => clearTimeout(timeout)
    }
    if (!isMouseOverHoverable && !isMouseOverModal) setIsShowInfo(false)
  }, [isMouseOverHoverable, setIsMouseOverHoverable, isMouseOverModal, setIsMouseOverModal])


  return (
    <>
      {isShowInfo && (
        <>
          <div className={` 
            zindex-[30]
            absolute top-0 left-0 w-full h-full
            flex justify-center items-center
            `}>
            <DndHoverDisplay
              milestone={passedMilestone}
              handleMouseOverFunc={setIsMouseOverModal}
              handlenMouseOutFunc={setIsMouseOverModal}
              closeFunction={() => setIsShowInfo(false)}
            />
          </div>
        </>
      )
      }

      <div key={id} ref={setNodeRef} style={style} {...attributes} {...listeners} className="mt-0">
        <div id={id} className='
          relative my-4 p-4
          font-poppins text-left text-base-content
          cursor-pointer 
          transition duration-500
          hover:bg-primary/30 
          hover:text-primary-focus
          min-h-[50px] min-w-[50px]  
          '
        >

          <div className="grid grid-rows-[70px_20px_20px]    ">
            <div
              className={`
                step ${passedMilestone.isComplete && 'step-primary'} 
                font-semibold capitalize 
                `}
              data-content={`${passedMilestone.isComplete ? '✓' : index + 1}`}
              onClick={() => onClickHandler(passedMilestone)}
            >
              <div className="
                max-w-[150px] truncate 
                text-wrap overflow-hidden self-end pt-1 
                "
                onMouseEnter={() => setIsMouseOverHoverable(true)}
                onMouseLeave={() => setIsMouseOverHoverable(false)}
              >
                {passedMilestone?.title}
              </div>
            </div>

            <div className="">
              {passedMilestone?.isComplete && (
                <div>
                  <div className='text-xs font-semibold text-center text-success'> {formatDateDayDate(passedMilestone?.completedAt)}</div>
                </div>
              )}

              {(passedMilestone?.dueDate && !passedMilestone?.isComplete) && (
                <div>
                  <div className='text-xs font-semibold text-center'> {formatDateDayDate(passedMilestone?.dueDate)}</div>
                </div>
              )}
            </div>

            <div className=" text-center">
              <Link to={id}>
                <TextBtn
                  text={linkTitle}
                  icon={EditIcon}
                  textSizeClass='text-xs'
                />
              </Link>
            </div>
          </div>
        </div>
      </div >

      {
        (!isLastItem) && (
          <div className="pt-6 text-primary">  {ArrowRight} </div>
        )
      }
    </>
  )
}

export default DndMilestonesSortable