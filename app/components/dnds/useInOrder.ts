import { useCallback } from "react";
import type { HasSortOrder } from "~/types/genericDndArrayTypes";

function useIsInOrder<T extends HasSortOrder>() {
  const isOrdered = useCallback((array: T[]): boolean => {
    array.sort((a, b) => a.sortOrder - b.sortOrder);
    const isNOTSequentialOrder = array.some((item, index) => {
      return item.sortOrder !== index;
    });
    return !isNOTSequentialOrder;
  }, []);
  return isOrdered;
}

export default useIsInOrder;
