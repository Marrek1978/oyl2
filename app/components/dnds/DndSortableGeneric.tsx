import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';

import H2WithLink from "~/components/titles/H2WithLink";
import TextProseWidth from "~/components/text/TextProseWidth";

interface SortableGenericProps {
  id: string;
  sortOrder: number;
  title: string;
  description: string | null;
  linkTitle?: string;
}

function DndSortableGeneric({ id, sortOrder, title, description,  linkTitle = 'Edit' }: SortableGenericProps) {
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
            // linkColor={}
            linkText={linkTitle}
          />

          <div className="mt-2">
            <TextProseWidth
              text={description || ''}
              // text={description}
            />
          </div>

        </div>
      </div>
    </>
  )
}

export default DndSortableGeneric