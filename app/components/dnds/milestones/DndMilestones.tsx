import { useFetcher } from '@remix-run/react';
import { useCallback, useEffect, useState } from 'react'

import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { SuccessMessageTimeout } from '~/components/dnds/constants';

import Modal from '~/components/modals/Modal';
import PageTitle from '~/components/titles/PageTitle';
import useInOrder from '~/components/dnds/useInOrder';
import SuccessMessage from '~/components/modals/SuccessMessage';
import useResetSortOrder from '~/components/dnds/useResetSortOrder';
import useCustomSensors from '~/components/dnds/useCustomDndSensors';
import DndSortableGeneric from '~/components/dnds/DndSortableGeneric';

import type { Milestone } from '@prisma/client';

// type Sortable<T extends { sortOrder: number } = { sortOrder: number }> = T;

interface Props {
  passedArray: Milestone[];
  dndTitle: string
}


function DndMilestones({ passedArray, dndTitle }: Props) {

  console.log('at top of file and passed Array is ', passedArray  )
  const fetcher = useFetcher();
  const [successMessage, setSuccessMessage] = useState('');
  const [itemsArray, setItemsArray] = useState<Milestone[]>([]);
  const [saveNewSortOrder, setSaveNewSortOrder] = useState<boolean>(false);


  const inOrder = useInOrder()
  const sensors = useCustomSensors();
  const reOrderItems = useResetSortOrder();

  useEffect(() => {
    if (!passedArray) return
    setItemsArray(passedArray)
  }, [passedArray])


  const setStateArrayInProperOrder = useCallback((array: Milestone[]) => {
    const isSequentialOrder: boolean = inOrder(array)
    console.log('isSequentialOrder', isSequentialOrder)
    if (isSequentialOrder) setItemsArray(array)
    if (!isSequentialOrder) {
      const reOrderedItemsArray = reOrderItems(array)
      console.log('reOrderedItemsArray', reOrderedItemsArray)
      setItemsArray(reOrderedItemsArray as Milestone[])
      setSaveNewSortOrder(true)
    }
  }, [reOrderItems, inOrder])


  useEffect(() => {
    if (!passedArray) return
    setStateArrayInProperOrder(passedArray)
  }, [passedArray, reOrderItems, setStateArrayInProperOrder])


  useEffect(() => {
    if (fetcher.state === 'loading') {
      setSuccessMessage(fetcher.data);
      setTimeout(() => setSuccessMessage(''), SuccessMessageTimeout); // Clear the message after 3 seconds
    }
  }, [fetcher])


  const handleEditSortOrder = useCallback(async () => {
    if (saveNewSortOrder === false) return
    
    const itemsString = JSON.stringify(itemsArray);
    try {
      fetcher.submit({
        itemsString
      }, {
        method: 'PUT',
        // action: '/dash/values',
      })
    } catch (error) { throw error }
    setSaveNewSortOrder(false);

  }, [itemsArray, fetcher, saveNewSortOrder])


  useEffect(() => {
    if (saveNewSortOrder === true) handleEditSortOrder()
  }, [saveNewSortOrder, handleEditSortOrder])


  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setItemsArray((prevValues: Milestone[]) => {
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
        </Modal>)
      }

      <PageTitle text={dndTitle} />
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={itemsArray?.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {itemsArray?.map((item) => (
            // <DndSortableValue
            <DndSortableGeneric
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description || ' '}
              sortOrder={item.sortOrder}
            />
          ))}

        </SortableContext>
      </DndContext >
    </>
  )
}

export default DndMilestones