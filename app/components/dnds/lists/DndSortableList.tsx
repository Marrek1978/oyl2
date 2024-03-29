import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { useParams } from '@remix-run/react';
import { useSortable } from '@dnd-kit/sortable';

import DndSortableListStyling from "../DndSortableListStyling";
import DraggableListItemWithLink from "./DraggableListItemWithLink";


type Props = {
  id: string;
  title: string | JSX.Element;
}

function DndSortableList({ id, title }: Props) {
  const params = useParams()

  const [isCurrentList, setIsCurrentList] = useState<boolean>(false)

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (!params.listId) return setIsCurrentList(false)
    setIsCurrentList(params.listId === id)
  }, [params, id])


  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mt-0">
        <DndSortableListStyling id={id} isHighlighted={isCurrentList} >
          <div className="mt-0 capitalize ">
            <DraggableListItemWithLink
              listTitle={title}
              linkDestination={id}
              linkText={'View List'}
              btnColorDaisyUI={'link'}
              textSizeTW={'xs'}
            />
          </div>
        </DndSortableListStyling>
      </div>
    </>
  )
}

export default DndSortableList