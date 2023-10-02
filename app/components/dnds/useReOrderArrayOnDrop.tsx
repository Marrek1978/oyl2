import { useCallback } from 'react'
import { arrayMove } from "@dnd-kit/sortable";

import type { HasSortOrder } from '~/types/genericDndArrayTypes'

function useReOrderArrayOnDrop<T extends HasSortOrder>() {
  const reOrderItems = useCallback((array: T[], active: { id: any }, over: { id?: any }): T[] => {
    const oldIndex = array.findIndex(item => item.id === active.id);
    const newIndex = array.findIndex(item => item.id === over?.id);
    const reOrderedItemsArray:T[] = arrayMove(array, oldIndex, newIndex);
    return reOrderedItemsArray
  }, [])
  return reOrderItems
}

export default useReOrderArrayOnDrop