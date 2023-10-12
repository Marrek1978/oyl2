import { useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react';

import DndInfo from '~/components/dnds/DndInfo';
import PageTitle from '~/components/titles/PageTitle';
import DndSortableGeneric from '~/components/dnds/values/DndSortableGeneric';
import DndAndSortableContexts from '~/components/dnds/DndAndSortableContexts';
import useDndDropOrderSaveFunctions from '~/components/dnds/useDndDropOrderSaveFunctions';

import type { Outcome } from '@prisma/client';


interface Props {
  passedOutcomes: Outcome[] | undefined;
}


function DndOutcomes({ passedOutcomes }: Props) {

  const fetcher = useFetcher();

  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const { handleDragEnd, setItemsArrayInProperOrder } = useDndDropOrderSaveFunctions({ fetcher, sortableArray: outcomes, setSortableArray: setOutcomes })


  //initial load
  useEffect(() => {
    if (!passedOutcomes) return
    setItemsArrayInProperOrder(passedOutcomes)
  }, [passedOutcomes, setItemsArrayInProperOrder])

 

  return (
    <>
      <PageTitle text='Outcomes' />

      <DndAndSortableContexts
        handleDragEnd={handleDragEnd}
        sortableArray={outcomes}
        isVertical={true}
      >
        <DndInfo />



        <div className='mt-4'>
          {outcomes?.map((outcome) => {

            const title = (<>
              <span className="text-sm">{outcome.sortOrder + 1}</span>. {outcome.title}
            </>)

            return (
              <DndSortableGeneric
                key={outcome.id}
                id={outcome.id}
                description={outcome.description || ''}
                title={title}
              />

            )
          })}
        </div>
      </DndAndSortableContexts>

    </>
  )
}


export default DndOutcomes


// export function areOutcomesInSequentialOrder(outcomes: Outcome[]): boolean {
//   outcomes.sort((a, b) => a.sortOrder - b.sortOrder)
//   const isNOTSequentialOrder = outcomes.some((outcome, index) => {
//     return outcome.sortOrder !== index
//   })
//   return !isNOTSequentialOrder
// }
