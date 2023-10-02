import TextBtn from "~/components/buttons/TextBtn";
import { Link, useFetcher } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';

import { formatDateDayDate } from '~/utils/functions';
import ServerMessages from "~/components/modals/ServerMessages";
import { ArrowRight, EditIcon } from "~/components/utilities/icons";
import useFetcherState from "~/components/utilities/useFetcherState";

import type { Milestone } from "@prisma/client";
import type { FetcherStateProps } from "~/components/utilities/useFetcherState";

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
  const [isCompleted, setIsCompleted] = useState<boolean>()
  const { isIdle, isLoading, isSubmitting, fetcherState, fetcherMessage } = useFetcherState({ fetcher } as FetcherStateProps);

  const loadedCompleted = useMemo(() => passedMilestone.isComplete, [passedMilestone.isComplete])

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const checkedMessage = isCompleted ? `Checked` : 'Unchecked'


  //initial loading of isCompleted
  useEffect(() => {
    setIsCompleted(loadedCompleted)
  }, [loadedCompleted, setIsCompleted])


  const handleSendToDb = (passedMilestone: Milestone) => {
    const milestone = {
      ...passedMilestone,
      isComplete: !passedMilestone.isComplete,
      completedAt: passedMilestone.isComplete ? null : new Date()
    }
    const toServerDataObj = {
      milestone,
      actionType: 'complete'
    }
    const toServerDataString = JSON.stringify(toServerDataObj)
    try {
      fetcher.submit({
        toServerDataString
      }, {
        method: 'PUT',
      })
    } catch (error) { throw error }
  }


  const onClickHandler = (milestone: Milestone) => {
    handleSendToDb(milestone)
    setIsCompleted(!isCompleted)
  }



  return (
    <>
      {isLoading || isIdle && (
        <ServerMessages
          fetcherState={fetcherState}
          fetcherMessage={fetcherMessage}
          showLoading={true}
          showSuccess={true}
          showFailed={true}
          successMessage={checkedMessage}
        // failureMessage
        />
      )}


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

            <div className={`
              ${!isSubmitting && (
                `step ${isCompleted && 'step-primary'}`
              )}
              font-semibold capitalize`}
              data-content={`${isCompleted ? '✓' : index + 1}`}
              onClick={() => onClickHandler(passedMilestone)}
            >
              <div className="
                max-w-[150px] truncate 
                text-wrap overflow-hidden self-end pt-1 
                "
              >
                {isSubmitting ? (
                  <div className="w-full flex justify-center"><span className="loading loading-ring loading-lg "></span></div>
                ) : (
                  passedMilestone?.title
                )}
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