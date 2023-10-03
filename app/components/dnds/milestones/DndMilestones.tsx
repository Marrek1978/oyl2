import { useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react';

import DndInfo from '~/components/dnds/DndInfo';
import ServerMessages from '~/components/modals/ServerMessages';
import useDndDropOrderSaveFunctions from '../useDndDropOrderSaveFunctions';
import DndAndSortableContexts from '~/components/dnds/DndAndSortableContexts';
import DndMilestonesSortable from '~/components/dnds/milestones/DndMilestonesSortable';
import useFetcherState, { type FetcherStateProps } from '~/components/utilities/useFetcherState';

import type { Milestone } from '@prisma/client';
import Heading14px from '~/components/titles/Heading14px';

interface Props {
  milestones: Milestone[]
}


function DndMilestones({ milestones }: Props) {

  const fetcher = useFetcher();
  const [milestonesArray, setMilestonesArray] = useState<any[]>([]);
  const { fetcherState, fetcherMessage } = useFetcherState({ fetcher } as FetcherStateProps);
  const { handleDragEnd, setItemsArrayInProperOrder } = useDndDropOrderSaveFunctions({ fetcher, sortableArray: milestonesArray, setSortableArray: setMilestonesArray })

  //initial load
  useEffect(() => {
    if (!milestones) return
    setItemsArrayInProperOrder(milestones)
  }, [milestones, setItemsArrayInProperOrder])


  return (
    <>

      <ServerMessages
        fetcherState={fetcherState}
        fetcherMessage={fetcherMessage}
        isShowLoading={false}
        isShowSuccess={false}
        isShowFailed={true}
        successMessage={'Moved'}
      />

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
                      arrayLength={milestonesArray?.length}
                      linkTitle='Edit'
                      index={index}
                      isLastItem={index === milestonesArray.length - 1}
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