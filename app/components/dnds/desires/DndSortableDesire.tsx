import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';

import H2WithLink from "~/components/headers/H2WithLink";
import SubHeading12px from "~/components/headers/SubHeading12px";
import { varsForPluralText } from '~/components/utilities/helperFunctions';

import type { Outcome, Value } from '@prisma/client';
import type { DesireWithValuesAndOutcomes } from '~/types/desireTypes';
import DndSortableStyling from '../DndSortableStyling';


interface SortableDesire {
  title: string | JSX.Element;
  id: string;
  linkTitle?: string;
  passedDesire: DesireWithValuesAndOutcomes;
  isShowValues?: boolean;
  isShowOutcomes?: boolean;
}


function DndSortableDesire({ id, title, linkTitle = 'Edit', passedDesire, isShowOutcomes = true, isShowValues = true }: SortableDesire) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const [isHasValues, setIsHasValues] = useState<boolean>(false);
  const [isHasOutcomes, setIsHasOutcomes] = useState<boolean>(false);

  const values = useGetValuesForDesire(passedDesire)
  const outcomes = useGetOutcomesForDesire(passedDesire)
  const { length: valuesLength } = varsForPluralText(values);
  const { length: outcomesLength } = varsForPluralText(outcomes);
  // const { plural: valueS, length: valuesLength } = varsForPluralText(values);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  useEffect(() => {
    if (values.length === 0) return
    setIsHasValues(true)
  }, [values])

  useEffect(() => {
    if (outcomes.length === 0) return
    setIsHasOutcomes(true)
  }, [outcomes])

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mt-4">
        <DndSortableStyling id={id} priorityStyling={''}>
          <H2WithLink
            h2Text={title}
            linkDestination={id}
            linkText={linkTitle}
          />

          {isHasOutcomes && isShowOutcomes && (
            <div className="flex flex-wrap gap-x-2 mt-1 items-start ">
              <div className='text-base-content/70 font-medium'>
                <SubHeading12px text={`For:`} />
              </div>
              {outcomes?.map((outcome, index) => {
                const title = outcome.title
                let id = uuidv4();
                let placeComma = index < outcomesLength - 1 ? ',' : ''
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
          )}

          {isHasValues && isShowValues && (
            <div className="flex flex-wrap gap-x-2 mt-1 items-start ">
              <div className='text-base-content/70 font-medium'>
                <SubHeading12px text={`Serves:`} />
              </div>
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
          )}


        </DndSortableStyling>
      </div>
    </>
  )
}

export default DndSortableDesire



export const useGetValuesForDesire = (desire: DesireWithValuesAndOutcomes): Value[] => {
  const [values, setValues] = useState<Value[]>([]);

  useEffect(() => {
    if (!desire.desireValues) return
    const valuesArray = desire.desireValues.map(obj => obj.value)
    setValues(valuesArray)
  }, [desire.desireValues])

  return values
}

export const useGetOutcomesForDesire = (desire: DesireWithValuesAndOutcomes): Outcome[] => {
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);

  useEffect(() => {
    if (!desire.outcomes) return
    const outcomesArray = desire.outcomes.map(obj => obj)
    setOutcomes(outcomesArray)
  }, [desire])

  return outcomes
}