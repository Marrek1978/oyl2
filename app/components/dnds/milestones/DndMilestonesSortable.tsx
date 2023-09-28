import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';

import TextBtn from "~/components/buttons/TextBtn";
import { Link, useFetcher } from "@remix-run/react";
import { ArrowRight, EditIcon } from "~/components/utilities/icons";

import type { Milestone } from "@prisma/client";
import { formatDateDayDate } from '~/utils/functions';

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


  return (
    <>
      <div key={id} ref={setNodeRef} style={style} {...attributes} {...listeners} className="mt-0">
        <div id={id} className='
          relative my-4
          font-poppins text-left text-base-content
          cursor-pointer 
          transition duration-500
          hover:bg-primary/30 
          hover:text-primary-focus
          max-w-prose
          h-full max-h-[120px]
          '>

          <div className="grid grid-rows-[70px_40px_30px]   ">
            <div
              className={`step ${passedMilestone.isComplete && 'step-primary'} font-semibold capitalize  selection:`}
              data-content={`${passedMilestone.isComplete ? '✓' : index + 1}`}
              onClick={() => onClickHandler(passedMilestone)}
            >
              {passedMilestone?.title}
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

      {(!isLastItem) && (
        <div className="pt-4 text-primary">  {ArrowRight} </div>
      )}
    </>
  )
}

export default DndMilestonesSortable