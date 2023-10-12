import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';

import H2WithLink from "~/components/titles/H2WithLink";
import SubHeading12px from "~/components/titles/SubHeading12px";
import { varsForPluralText } from '~/components/utilities/helperFunctions';

import type { Value } from '@prisma/client';
import type { DesireWithValues } from '~/types/desireTypes';
import DndSortableStyling from '../DndSortableStyling';


interface SortableDesire {
  title: string | JSX.Element;
  id: string;
  linkTitle?: string;
  passedDesireWithValues: DesireWithValues;
}


function DndSortableDesire({ id, title, linkTitle = 'Edit', passedDesireWithValues, }: SortableDesire) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const [isHasValues, setIsHasValues] = useState<boolean>(false);

  const values = useGetValuesForDesire(passedDesireWithValues)
  const { plural: valueS, length: valuesLength } = varsForPluralText(values);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  useEffect(() => {
    if (values.length === 0) return
    setIsHasValues(true)
  }, [values])

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mt-4">
        <DndSortableStyling id={id} priorityStyling={''}>
          <H2WithLink
            h2Text={title}
            linkDestination={id}
            linkText={linkTitle}
          />

          {isHasValues && (
            <div className="flex flex-wrap gap-x-2 mt-1 items-start ">
              <div className='text-base-content/70 font-medium'>
                <SubHeading12px text={`Serves Value${valueS}:`} />
              </div>
              <div className='flex flex-wrap gap-x-2 font-semibold '>
                {values?.map((value, index) => {
                  const title = value.title
                  let id = uuidv4();
                  let placeComma = index < valuesLength - 1 ? ',' : ''
                  return (
                    <div key={id}
                      className={`
                        font-bold
                        text-secondary/70
                    `} >
                      <SubHeading12px text={`${title}${placeComma} `} />
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </DndSortableStyling>
      </div>
    </>
  )
}

export default DndSortableDesire



export const useGetValuesForDesire = (desire: DesireWithValues): Value[] => {
  const [values, setValues] = useState<any[]>([]);

  useEffect(() => {
    if (!desire.desireValues) return
    const valuesArray = desire.desireValues.map(obj => obj.value)
    setValues(valuesArray)
  }, [desire.desireValues])

  return values
}