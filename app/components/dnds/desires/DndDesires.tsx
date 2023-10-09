import { useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react';

import DndInfo from '../DndInfo';
import DndSortableDesire from './DndSortableDesire';
import PageTitle from '~/components/titles/PageTitle';
import DndAndSortableContexts from '../DndAndSortableContexts';
import useDndDropOrderSaveFunctions from '../useDndDropOrderSaveFunctions';

import type { DesireWithValues } from '~/types/desireTypes'


interface Props {
  passedDesires: DesireWithValues[] | undefined;
}

const DndDesires = ({ passedDesires }: Props) => {
  const fetcher = useFetcher();
  const [desires, setDesires] = useState<DesireWithValues[]>([]);
  const { handleDragEnd, setItemsArrayInProperOrder } = useDndDropOrderSaveFunctions({ fetcher, sortableArray: desires, setSortableArray: setDesires })

  //initial load
  useEffect(() => {
    if (!passedDesires) return
    setItemsArrayInProperOrder(passedDesires)
  }, [passedDesires, setItemsArrayInProperOrder])


  return (
    <>
      <PageTitle text='Desires' />
      <DndAndSortableContexts
        handleDragEnd={handleDragEnd}
        sortableArray={desires}
        isVertical={true}
      >
        <DndInfo />

        {desires?.map((desire) => {
            const title = (<>
              <span className="text-sm">{desire.sortOrder + 1}</span>. {desire.title}
            </>)

          return (
            <DndSortableDesire
              key={desire.id}
              id={desire.id}
              title={title}
              linkTitle='Go to desire'
              passedDesireWithValues={desire}
            />
          )
        })}

      </DndAndSortableContexts>
    </>
  )
}

export default DndDesires

