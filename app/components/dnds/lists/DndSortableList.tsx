import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';

import DndSortableStyling from "../DndSortableStyling";
import H2WithLink from "~/components/titles/H2WithLink";


type Props = {
  id: string;
  title: string | JSX.Element;
}

function DndSortableList({ id, title }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };



  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mt-0">
        <DndSortableStyling id={id} priorityStyling={''}>
          <div className="mt-0 capitalize max-h-[60px] overflow-hidden">
            <H2WithLink
              h2Text={title}
              linkDestination={id}
              linkText={'See List'}
              btnColorDaisyUI={'link'}
            />
          </div>
        </DndSortableStyling>
      </div>
    </>
  )
}

export default DndSortableList