import { useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react';

import DndInfo from '~/components/dnds/DndInfo';
import Heading14px from '~/components/titles/Heading14px';
import useServerMessages from '~/components/modals/useServerMessages';
import useDndDropOrderSaveFunctions from '../useDndDropOrderSaveFunctions';
import DndAndSortableContexts from '~/components/dnds/DndAndSortableContexts';
import DndMilestonesSortable from '~/components/dnds/milestones/DndMilestonesSortable';
import useFetcherState, { type FetcherStateProps } from '~/components/utilities/useFetcherState';

import type { Milestone } from '@prisma/client';

interface Props {
  milestones: Milestone[]
}


function DndMilestones({ milestones }: Props) {

  const fetcher = useFetcher();
  const [milestonesArray, setMilestonesArray] = useState<any[]>([]);
  const { fetcherState, fetcherMessage } = useFetcherState({ fetcher } as FetcherStateProps);
  const { handleDragEnd, setItemsArrayInProperOrder } = useDndDropOrderSaveFunctions({ fetcher, sortableArray: milestonesArray, setSortableArray: setMilestonesArray })

  useServerMessages({
    fetcherState,
    fetcherMessage,
    isShowSuccess: false,
    successMessage: 'Saved',
    isShowFailed: true,
    failureMessage: 'Something went wrong',
  });


  //initial load
  useEffect(() => {
    if (!milestones) return
    setItemsArrayInProperOrder(milestones)
  }, [milestones, setItemsArrayInProperOrder])


  return (
    <>
      <DndAndSortableContexts
        handleDragEnd={handleDragEnd}
        sortableArray={milestonesArray}
        isVertical={false}
      >
        <DndInfo />
        <div className='grid-none w-full flex flex-wrap justify-center overflow-hidden '>
          <ul className='steps overflow-visible scrollbar-hidden'>
            {milestonesArray?.length === 0 ? (
              <Heading14px
                text='No Milestones have been added yet.  Please use the link below to add one.'
              />
            ) : (
              <>
                {milestonesArray?.map((item, index) => {
                  return (
                    <DndMilestonesSortable
                      key={item.id}
                      id={item.id}
                      passedMilestone={item}
                      index={index}
                    />
                  )
                })}
              </>
            )}
          </ul>
        </div>
      </DndAndSortableContexts>
    </>
  )
}

export default DndMilestones