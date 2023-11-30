import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';

import DndSortableStyling from "../DndSortableStyling";
import H2WithLink from "~/components/titles/H2WithLink";
import TextProseWidth from "~/components/text/TextProseWidth";
import SubHeading14px from "~/components/titles/SubHeading14px";
import SubHeading12px from "~/components/titles/SubHeading12px";

interface SortableGenericProps {
  id: string;
  title: string | JSX.Element;
  description: string;
  linkTitle?: string;
  isShowDescription?: boolean;
}

function DndSortableGeneric({ id, title, description, linkTitle = 'Edit', isShowDescription = true }: SortableGenericProps) {

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className=" ">
        <DndSortableStyling id={id} priorityStyling={''}>
          <H2WithLink
            h2Text={title}
            linkDestination={id}
            linkText={linkTitle}
            btnColorDaisyUI={'link'}
          />
          <div className="flex gap-x-3 flex-wrap items-baseline">

          <SubHeading14px text='22 days' />
          <SubHeading12px text='7 days, 55 days' />
          </div>
          <div className="mt-2 ">
            {isShowDescription && (
              <TextProseWidth
                text={description}
              />
            )}
          </div>

        </DndSortableStyling>
      </div>
    </>
  )
}

export default DndSortableGeneric