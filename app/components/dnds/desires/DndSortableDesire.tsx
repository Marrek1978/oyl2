
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

  const { plural: valueS, length: valuesLength } = varsForPluralText(desireValues);
  const { plural: outcomeS, length: outcomesLength } = varsForPluralText(desireOutcomes);


  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mt-4">
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
            <div className="grid grid-cols-[120px_1fr] gap-x-2 gap-y-0 mt-1 items-start ">
              <div className='text-base-content/70 font-medium'>
                <SubHeading12px text={`Serves Value${valueS}:`} />
              </div>
              <div className='flex flex-wrap gap-x-2 font-semibold'>
                {desireValues?.map((value, index) => {
                  const title = value.value.valueTitle
                  let id = uuidv4();
                  let placeComma = index < valuesLength - 1 ? ',' : ''
                  return (
                    <div key={id}
                      className={`
                        font-bold
                        text-base-content/70
                    `} >
                      <SubHeading12px text={`${title}${placeComma} `} />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {hasOutcomes && (
            <div className="grid grid-cols-[120px_1fr] gap-x-2 items-start mt-1 ">
              <div className='text-base-content/70 font-medium '>
                <SubHeading12px text={`Has Outome${outcomeS}:`} />
              </div>
              <div className='flex flex-wrap gap-x-2 font-semibold'>
                {desireOutcomes?.map((outcome, index) => {
                  const title = outcome.title
                  let id = uuidv4();
                  let placeComma = index < outcomesLength - 1 ? ',' : ''
                  return (
                    <div key={id}
                      className={`
                      font-bold
                      text-base-content/70
                    `} >
                      <SubHeading12px text={`${title}${placeComma} `} />
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

export function varsForPluralText(array: any[]): { plural: string, length: number } {
  const plural = array && array.length > 1 ? 's' : '';
  const length = array.length
  return { plural, length }
}