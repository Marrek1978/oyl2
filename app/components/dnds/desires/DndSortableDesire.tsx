
import { v4 as uuidv4 } from 'uuid';

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';

import H2WithLink from "~/components/titles/H2WithLink";
import SubHeading12px from "~/components/titles/SubHeading12px";

import type { DesireOutcome, Value } from "@prisma/client";


interface SortableGenericDesire {
  title: string;
  id: string;
  linkTitle?: string;
  desireValues?: { value: Value }[]
  desireOutcomes?: DesireOutcome[]
}


function DndSortableDesire({ id, title, linkTitle = 'Edit', desireValues = [], desireOutcomes = [] }: SortableGenericDesire) {

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const hasValues = desireValues?.length > 0;
  const hasOutcomes = desireOutcomes?.length > 0

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
            title={title}
            linkDestination={id}
            linkText={linkTitle}
          />

          {hasValues && (
            <div className="grid grid-cols-[130px_1fr] gap-2 items-start mt-1 font-bold ">
              <div className='text-secondary/70'>
                <SubHeading12px text={'Serves Values:'} />
              </div>
              <div className='flex flex-wrap gap-2'>
                {desireValues?.map((value) => {
                  const title = value.value.valueTitle
                  let id = uuidv4();
                  return (
                    <div key={id}
                      className={`
                        font-bold
                        text-secondary
                    `} >
                      <SubHeading12px text={`${title}, `} />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {hasOutcomes && (
            <div className="grid grid-cols-[130px_1fr] gap-2 items-start mt-1 font-bold ">
              <div className='text-base-content/70 '>
                <SubHeading12px text={'Withs Outomes:'} />
              </div>
              <div className='flex flex-wrap gap-2'>
                {desireOutcomes?.map((outcome) => {
                  const title = outcome.title
                  let id = uuidv4();
                  return (
                    <div key={id}
                      className={`
                      font-bold
                      text-base-content
                    `} >
                      <SubHeading12px text={`${title}, `} />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default DndSortableDesire