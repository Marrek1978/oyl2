import { useCallback } from "react";

function useInOrder() {
  const isOrdered = useCallback((array: any[]) => {
    array.sort((a, b) => a.sortOrder - b.sortOrder);
    const isNOTSequentialOrder = array.some((item, index) => {
      return item.sortOrder !== index;
    });
    return !isNOTSequentialOrder;
  }, []);
  return isOrdered;
}

export default useInOrder;
