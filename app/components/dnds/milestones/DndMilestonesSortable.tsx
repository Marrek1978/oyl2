

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
  // const [isIdle, setIsIdle] = useState(true)
  // const [isLoading, setIsLoading] = useState(false)
  const [completed, setCompleted] = useState<boolean>()
  // const [isSubmitting, setIsSubmitting] = useState(false)
  // const [fetcherState, setFetcherState] = useState<string>()
  // const [fetcherMessage, setFetcherMessage] = useState<'success' | 'failed' | undefined>()

  const loadedCompleted = useMemo(() => passedMilestone.isComplete, [passedMilestone.isComplete])
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  // useEffect(() => {
  //   setIsSubmitting(fetcher.state === 'submitting')
  //   setIsLoading(fetcher.state === 'loading')
  //   setIsIdle(fetcher.state === 'idle')
  //   setFetcherState(fetcher.state)
  //   setFetcherMessage(fetcher.data || '')
  // }, [fetcher])

  const {isIdle, isLoading, isSubmitting, fetcherState, fetcherMessage} = useFetcherState()

  console.log('isIdle', isIdle) 
  useEffect(() => {
    setCompleted(loadedCompleted)
  }, [loadedCompleted, setCompleted])


  const handleSendToDb = (passedMilestone: Milestone) => {
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
    handleSendToDb(milestone)
    setCompleted(!completed)
  }

  const checkedMessage = completed ? `Checked` : 'Unchecked'

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
                `step ${completed && 'step-primary'}`
              )}
              font-semibold capitalize 
              `}
              data-content={`${completed ? '✓' : index + 1}`}
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