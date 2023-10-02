import { useEffect, useState } from 'react'
import { useFetcher, useLoaderData } from '@remix-run/react';

import DndInfo from '~/components/dnds/DndInfo';
import ServerMessages from '~/components/modals/ServerMessages';
import useDndDropOrderSaveFunctions from '../useDndDropOrderSaveFunctions';
import DndAndSortableContexts from '~/components/dnds/DndAndSortableContexts';
import DndMilestonesSortable from '~/components/dnds/milestones/DndMilestonesSortable';
import useFetcherState, { type FetcherStateProps } from '~/components/utilities/useFetcherState';



function DndMilestones() {

  const fetcher = useFetcher();
  const loadedData = useLoaderData()
  const [milestonesArray, setMilestonesArray] = useState<any[]>([]);

  const { isIdle, isLoading, fetcherState, fetcherMessage } = useFetcherState({ fetcher } as FetcherStateProps);
  const { handleDragEnd, setItemsArrayInProperOrder } = useDndDropOrderSaveFunctions({ fetcher, sortableArray: milestonesArray, setSortableArray: setMilestonesArray })

  //initial load
  useEffect(() => {
    if (!loadedData) return
    const { milestones } = loadedData
    if (!milestones) return
    setItemsArrayInProperOrder(milestones)
  }, [loadedData, setItemsArrayInProperOrder])



  return (
    <>

      {isLoading || isIdle && (
        <ServerMessages
          fetcherState={fetcherState}
          fetcherMessage={fetcherMessage}
          showLoading={true}
          showSuccess={true}
          showFailed={true}
          successMessage={'Moved'}
        // failureMessage
        />
      )}


      <DndAndSortableContexts
        handleDragEnd={handleDragEnd}
        sortableArray={milestonesArray}
        isVertical={false}
      >

        <DndInfo />

        <div className='steps grid-none w-full flex flex-wrap justify-center '>
          <div className="flex flex-wrap max-w-screen-lg overflow-hidden ">
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
          </div>
        </div>

      </DndAndSortableContexts>
    </>
  )
}

export default DndMilestones