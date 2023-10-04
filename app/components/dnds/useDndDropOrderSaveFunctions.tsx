import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import type { FetcherWithComponents } from '@remix-run/react';

import type { DragEndEvent } from '@dnd-kit/core';

import useIsInOrder from '~/components/dnds/useInOrder';
import useReOrderArrayOnDrop from './useReOrderArrayOnDrop';
import useSetSortOrderToNewIndex from '~/components/dnds/useSetSortOrderToNewIndex';

import type { HasSortOrder } from '~/types/genericDndArrayTypes'


// type Props<T extends HasSortOrder & { id: string }> = {
interface Props<T extends HasSortOrder> {
  fetcher: FetcherWithComponents<any>;
  sortableArray: T[];
  setSortableArray: React.Dispatch<React.SetStateAction<T[]>>;
}

function useDndDropOrderSaveFunctions<T extends HasSortOrder>({
  fetcher,
  sortableArray,
  setSortableArray,
}: Props<T>) {

  const inOrder = useIsInOrder()
  const reOrderArrayOnDrop = useReOrderArrayOnDrop<T>()
  const setSortOrderToNewIndex = useSetSortOrderToNewIndex<T>();
  const [saveNewSortOrder, setSaveNewSortOrder] = useState<boolean>(false);


  const sendToDb = useCallback(async () => {
    console.log('saving to db')
    const toServerDataObj = {
      sortableArray,
      actionType: 'editSortOrder'
    }
    const toServerDataString = JSON.stringify(toServerDataObj);
    try {
      fetcher.submit({
        toServerDataString
      }, {
        method: 'PUT',
      })
    } catch (error) { throw error }
    setSaveNewSortOrder(false);
  }, [sortableArray, setSaveNewSortOrder, fetcher,])

  //useeffects
  useEffect(() => {
    if (saveNewSortOrder === true) sendToDb()
  }, [saveNewSortOrder, sendToDb])

  //fucntions
  function handleDragEnd(event: DragEndEvent) {
    console.log('drag end')
    const { active, over } = event;
    if (!over || active.id === over?.id) return
    console.log('sortableArray is: ', sortableArray)
    
    const reOrderedItemsArray: T[] = reOrderArrayOnDrop(sortableArray, active, over)
    console.log('reOrderedItemsArray is: ', reOrderedItemsArray)
    const updatedSortOrders:T[] = setSortOrderToNewIndex(reOrderedItemsArray)
    console.log('updatedSortOrders is: ', updatedSortOrders)
    setSortableArray(updatedSortOrders)
    setSaveNewSortOrder(true)
  }

  const setItemsArrayInProperOrder = useCallback((sortableArray: T[]) => {
    const isInOrder = inOrder(sortableArray)
    if (isInOrder) return setSortableArray(sortableArray)
    //else
    const reOrderedItemsArray = setSortOrderToNewIndex(sortableArray)
    setSortableArray(reOrderedItemsArray)
    setSaveNewSortOrder(true)
  }, [inOrder, setSortOrderToNewIndex, setSaveNewSortOrder, setSortableArray])

  return { handleDragEnd, setItemsArrayInProperOrder }
}

export default useDndDropOrderSaveFunctions

