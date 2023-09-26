import { useFetcher } from '@remix-run/react';
import { useCallback, useEffect, useState } from 'react'

import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import Modal from '~/components/modals/Modal';
import { SuccessMessageTimeout } from './constants';
import PageTitle from '~/components/titles/PageTitle';
import SuccessMessage from '~/components/modals/SuccessMessage';
import useCustomSensors from '~/components/dnds/useCustomDndSensors';

import useResetSortOrder from './useResetSortOrder';
import useInOrder from '~/components/dnds/useInOrder';
import DndSortableGeneric from './DndSortableGeneric';

import type { Sortable } from '~/types/genericArrayTypes';

// type Sortable<T extends { sortOrder: number } = { sortOrder: number }> = T;

interface Props<T extends { id: string, sortOrder: number, title: string, description: string | null}> {
  passedArray: Sortable<T>[];
  dndTitle: string
}


function DndGenericContext<T extends { id: string, sortOrder: number, title: string, description: string | null}>({ passedArray, dndTitle }: Props<T>) {

  const fetcher = useFetcher();
  const [successMessage, setSuccessMessage] = useState('');
  const [stateArray, setStateArray] = useState<Sortable<T>[]>([]);
  const [saveNewSortOrder, setSaveNewSortOrder] = useState<boolean>(false);


  const inOrder = useInOrder()
  const sensors = useCustomSensors();
  const reOrderItems = useResetSortOrder<T>();

  useEffect(() => {
    if (!passedArray) return
    setStateArray(passedArray)
  }, [passedArray])


  const setStateArrayInProperOrder = useCallback((array: Sortable<T>[]) => {
    const isSequentialOrder: boolean = inOrder(array)
    if (isSequentialOrder) setStateArray(array)
    if (!isSequentialOrder) {
      const reOrderedItemsArray = reOrderItems(array)
      setStateArray(reOrderedItemsArray)
      // setItemsArray(reOrderItems(itemsArray))
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
    const itemsString = JSON.stringify(stateArray);
    try {
      fetcher.submit({
        itemsString
      }, {
        method: 'PUT',
        // action: '/dash/values',
      })
    } catch (error) { throw error }
    setSaveNewSortOrder(false);
  }, [stateArray, fetcher])


  useEffect(() => {
    if (saveNewSortOrder) handleEditSortOrder()
  }, [saveNewSortOrder, handleEditSortOrder])


  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setStateArray((prevValues: Sortable<T>[]) => {
        const oldIndex = prevValues.findIndex(value => value.id === active.id);
        const newIndex = prevValues.findIndex(value => value.id === over?.id);
        const newValues = arrayMove(prevValues, oldIndex, newIndex);
        setSaveNewSortOrder(true)
        return reOrderItems(newValues)
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
          items={stateArray?.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {stateArray?.map((item) => (
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


export default DndGenericContext

