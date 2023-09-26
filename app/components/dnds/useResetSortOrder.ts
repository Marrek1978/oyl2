import { useCallback } from "react";

// type WithSortOrder<T> = T & { sortOrder: number };
function useResetSortOrder<T extends { sortOrder: number }>() {
  const newSortOrder = useCallback((items: T[]): T[] => {
    const reOrdered = items.map((item, index) => ({
      ...item,
      sortOrder: index,
    }));
    return reOrdered as T[];
  }, []);

  return newSortOrder;
}

export default useResetSortOrder;
