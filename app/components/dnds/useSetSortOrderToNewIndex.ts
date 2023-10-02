import { useCallback } from "react";
import type { HasSortOrder } from '~/types/genericDndArrayTypes'

// type WithSortOrder<T> = T & { sortOrder: number };
function useSetSortOrderToNewIndex<T extends HasSortOrder>() {
  const newSortOrder = useCallback((items: T[]) => {
    const reOrdered = items.map((item, index) => ({
      ...item,
      sortOrder: index,
    }));
    return reOrdered;
  }, []);

  return newSortOrder ;
}

export default useSetSortOrderToNewIndex;
