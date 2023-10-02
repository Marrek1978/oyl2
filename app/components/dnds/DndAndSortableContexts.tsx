import { DndContext, type  DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy } from "@dnd-kit/sortable";

import useCustomSensors from "./useCustomDndSensors";

import type { HasSortOrder } from "~/types/genericDndArrayTypes";


type Props<T extends HasSortOrder & { id: string }> = {
  handleDragEnd: (event: DragEndEvent) => void;
  sortableArray: T[];
  children: React.ReactNode;
  isVertical?: boolean;
}

function DndAndSortableContexts<T extends HasSortOrder & { id: string }>({
  handleDragEnd,
  sortableArray,
  children,
  isVertical = true
}: Props<T>) {

  const sensors = useCustomSensors();
  const strategy = isVertical ? verticalListSortingStrategy: horizontalListSortingStrategy

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={sortableArray?.map((item) => item.id)}
          strategy={strategy}
        >
          {children}
        </SortableContext>
      </DndContext >
    </>
  )
}

export default DndAndSortableContexts