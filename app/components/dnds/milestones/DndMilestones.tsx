import { useFetcher } from '@remix-run/react';
import { useCallback, useEffect, useState } from 'react'

import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";


import DndInfo from '../DndInfo';
import Modal from '~/components/modals/Modal';
import useInOrder from '~/components/dnds/useInOrder';
import SuccessMessage from '~/components/modals/SuccessMessage';
import { SuccessMessageTimeout } from '~/components/dnds/constants';
import useResetSortOrder from '~/components/dnds/useResetSortOrder';
import useCustomSensors from '~/components/dnds/useCustomDndSensors';
import DndMilestonesSortable from '~/components/dnds/milestones/DndMilestonesSortable';

import type { Milestone } from '@prisma/client';
import type { MilestoneGroupsWithMilestones } from '~/types/milestoneTypes';

interface Props {
  passedMilestoneGroup: MilestoneGroupsWithMilestones | undefined;
  dndTitle: string
}


function DndMilestones({ passedMilestoneGroup, dndTitle }: Props) {

  const fetcher = useFetcher();
  const [successMessage, setSuccessMessage] = useState('');
  const [milestonesArray, setMilestonesArray] = useState<Milestone[]>([]);
  const [saveNewSortOrder, setSaveNewSortOrder] = useState<boolean>(false);


  const inOrder = useInOrder()
  const sensors = useCustomSensors();
  const reOrderItems = useResetSortOrder();


  const setStateArrayInProperOrder = useCallback((array: Milestone[]) => {
    const isSequentialOrder: boolean = inOrder(array)
    if (isSequentialOrder) setMilestonesArray(array)
    if (!isSequentialOrder) {
      const reOrderedItemsArray = reOrderItems(array)
      setMilestonesArray(reOrderedItemsArray as Milestone[])
      setSaveNewSortOrder(true)
    }
  }, [reOrderItems, inOrder])


  useEffect(() => {
    if (!passedMilestoneGroup) return
    const { milestones, ...group } = passedMilestoneGroup
    if (!group) return
    if (!milestones) return
    setStateArrayInProperOrder(milestones)
  }, [passedMilestoneGroup, setStateArrayInProperOrder])


  useEffect(() => {
    if (fetcher.state === 'loading') {
      setSuccessMessage(fetcher.data);
      setTimeout(() => setSuccessMessage(''), SuccessMessageTimeout); // Clear the message after 3 seconds
    }
  }, [fetcher])


  const handleEditSortOrder = useCallback(async () => {
    if (saveNewSortOrder === false) return
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
  }, [milestonesArray, fetcher, saveNewSortOrder])


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
      {successMessage && (
        <Modal onClose={() => { }} zIndex={20}>
          <SuccessMessage
            text={successMessage}
          />
        </Modal>
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
                console.log('item.completedAt', typeof item.completedAt)
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