import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';

import H2WithLink from "~/components/titles/H2WithLink";
import TextProseWidth from "~/components/text/TextProseWidth";

interface SortableGenericProps {
  id: string;
  title: string;
  description: string;
  linkTitle?: string;
}

function DndSortableValue({ id, title, description, linkTitle = 'Edit' }: SortableGenericProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mt-0">
        <div key={id} id={id} className='
          px-3 py-4 
          mt-4
          font-poppins
          cursor-pointer 
          text-left text-base-content
          transition duration-500
          hover:bg-primary/30 
          hover:text-primary-focus
          max-w-prose
        '>

          <H2WithLink
            h2Text={title}
            linkDestination={id}
            linkText={linkTitle}
            btnColorDaisyUI={'link'}
          />

          <div className="mt-1">
            <TextProseWidth
              text={description}
            />
          </div>

        </div>
      </div>
    </>
  )
}

export default DndSortableValue