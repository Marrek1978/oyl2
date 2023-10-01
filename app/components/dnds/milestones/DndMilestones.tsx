import { useFetcher } from '@remix-run/react';
import { useCallback, useEffect, useMemo, useState } from 'react'

import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";


import DndInfo from '../DndInfo';
import Modal from '~/components/modals/Modal';
import useInOrder from '~/components/dnds/useInOrder';
import SuccessMessage from '~/components/modals/SuccessMessage';
import useResetSortOrder from '~/components/dnds/useResetSortOrder';
import useCustomSensors from '~/components/dnds/useCustomDndSensors';
import DndMilestonesSortable from '~/components/dnds/milestones/DndMilestonesSortable';

import type { Milestone, MilestoneGroup } from '@prisma/client';
import type { MilestoneGroupsWithMilestones } from '~/types/milestoneTypes';
import { useLoaderData } from '@remix-run/react';
import { SuccessMessageTimeout } from '../../utilities/constants';
import ServerMessages from '~/components/modals/ServerMessages';

interface Props {
  passedMilestoneGroup: MilestoneGroupsWithMilestones | undefined;
  dndTitle: string
}


function DndMilestones({ passedMilestoneGroup, dndTitle }: Props) {

  const fetcher = useFetcher();
  const [isIdle, setIsIdle] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [fetcherState, setFetcherState] = useState<string>()
  const [fetcherMessage, setFetcherMessage] = useState<'success' | 'failed' | undefined>()

  const loadedData = useLoaderData()

  const [milestonesArray, setMilestonesArray] = useState<any[]>([]);
  const [saveNewSortOrder, setSaveNewSortOrder] = useState<boolean>(false);

  const inOrder = useInOrder()
  const sensors = useCustomSensors();
  const reOrderItems = useResetSortOrder();

  useEffect(() => {
    setIsLoading(fetcher.state === 'loading')
    setIsIdle(fetcher.state === 'idle')
    setFetcherState(fetcher.state)
    setFetcherMessage(fetcher.data || '')
  }, [fetcher])


  const handleEditSortOrder = useCallback(async () => {
    const editOrder = {
      milestonesArray,
      actionType: 'editOrder'
    }
    const submitedString = JSON.stringify(editOrder);
    try {
      fetcher.submit({
        submitedString
      }, {
        method: 'PUT',
      })
    } catch (error) { throw error }
    setSaveNewSortOrder(false);
  }, [milestonesArray, fetcher,])


  const setStateArrayInProperOrder = useCallback((array: any[]) => {
    if (inOrder(array)) {
      setMilestonesArray(array)
    } else {
      const reOrderedItemsArray = reOrderItems(array)
      setMilestonesArray(reOrderedItemsArray as Milestone[])
      setSaveNewSortOrder(true)
    }
  }, [reOrderItems, inOrder])


  //initial load
  useEffect(() => {
    if (!loadedData) return
    const { milestones } = loadedData
    if (!milestones) return
    setStateArrayInProperOrder(milestones)
  }, [loadedData, setStateArrayInProperOrder])


  useEffect(() => {
    if (saveNewSortOrder === true) handleEditSortOrder()
  }, [saveNewSortOrder, handleEditSortOrder])


  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setMilestonesArray((prevValues: Milestone[]) => {
        const oldIndex = prevValues.findIndex(value => value.id === active.id);
        const newIndex = prevValues.findIndex(value => value.id === over?.id);
        const newValues = arrayMove(prevValues, oldIndex, newIndex);
        setSaveNewSortOrder(true)
        return reOrderItems(newValues) as Milestone[]
      })
    }
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
          successMessage={'Moved'}
        // failureMessage
        />
      )}



      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={milestonesArray?.map(item => item.id)}
          strategy={horizontalListSortingStrategy}
        >
          <DndInfo />

          <div className='steps grid-none w-full flex justify-center'>
            <div className="flex flex-wrap max-w-[1200px] ">
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
        </SortableContext>
      </DndContext >
    </>
  )
}

export default DndMilestones