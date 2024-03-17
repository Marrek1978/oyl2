import { Link, useFetcher } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';

import { formatDateDayDate } from '~/utils/functions';
import BtnWithProps from "~/components/buttons/BtnWithProps";
import useFetcherState from "~/components/utilities/useFetcherState";
import useServerMessages from "~/components/displays/modals/useServerMessages";

import type { Milestone } from "@prisma/client";
import type { FetcherStateProps } from "~/components/utilities/useFetcherState";

interface MilestoneSortableProps {
  id: string;
  passedMilestone: Milestone
  index: number
}


function DndMilestonesSortable({ id, passedMilestone, index }: MilestoneSortableProps) {

  const fetcher = useFetcher();
  const [isCompleted, setIsCompleted] = useState<boolean>()
  const { isIdle, fetcherState, fetcherMessage } = useFetcherState({ fetcher } as FetcherStateProps);

  const loadedCompleted = useMemo(() => passedMilestone.isComplete, [passedMilestone.isComplete])

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useServerMessages({
    fetcherState,
    fetcherMessage,
    failureMessage: 'Something went wrong',
  });


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

      <li key={id} ref={setNodeRef} style={style} {...attributes} {...listeners}
        className={`mt-0  
        ${isIdle && (
            `step ${isCompleted && 'step-primary'}`
          )}
        `}
        data-content={`${isCompleted ? '✓' : index + 1}`}
        onClick={() => onClickHandler(passedMilestone)}
      >
        <div className='
          relative  pt-2 px-4 pb-4
          font-poppins text-left text-base-content
          cursor-pointer 
          transition duration-500
          hover:bg-primary/30 
          hover:text-primary-focus
          min-h-[50px] min-w-[50px]  
          '  >

          <div className="grid grid-rows-[25px_40px_20px]  text-center  ">

            <div className="
              max-w-[150px] 
              truncate font-semibold capitalize 
              overflow-hidden 
              ">
              {!isIdle ? (
                <div className="w-full flex justify-center"><span className="loading loading-ring loading-lg "></span></div>
              ) : (
                passedMilestone?.title
              )}
            </div>


            <div>
              {passedMilestone?.isComplete && (
                <div>
                  <div className='text-xs font-semibold   text-success'> {formatDateDayDate(passedMilestone?.completedAt)}</div>
                </div>
              )}

              {(passedMilestone?.dueDate && !passedMilestone?.isComplete) && (
                <div>
                  <div className='text-xs font-semibold '> {formatDateDayDate(passedMilestone?.dueDate)}</div>
                </div>
              )}
            </div>

            <Link to={id} onClick={(e) => e.stopPropagation()}>
              <BtnWithProps
                btnPurpose={"goto"}
                fontWidthTW='bold'
              />
            </Link>
          </div>
        </div>
      </li >
    </>
  )
}

export default DndMilestonesSortable