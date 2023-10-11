import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';

import H2WithLink from "~/components/titles/H2WithLink";
import TextProseWidth from "~/components/text/TextProseWidth";
import DndSortableStyling from "../DndSortableStyling";

interface SortableGenericProps {
  id: string;
  title: string | JSX.Element;
  description: string;
  linkTitle?: string;
}

function DndSortableGeneric({ id, title, description, linkTitle = 'Edit' }: SortableGenericProps) {
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
          <H2WithLink
            h2Text={title}
            linkDestination={id}
            linkText={linkTitle}
            btnColorDaisyUI={'link'}
          />

          <div className="mt-2">
            <TextProseWidth
              text={description}
            />
          </div>

        </DndSortableStyling> 
      </div>
    </>
  )
}

export default DndSortableGeneric