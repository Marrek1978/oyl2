import { useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react';

import DndInfo from '~/components/dnds/DndInfo';
import PageTitle from '~/components/titles/PageTitle';
import DndAndSortableContexts from '~/components/dnds/DndAndSortableContexts';
import DndSortableGeneric from '~/components/dnds/values/DndSortableGeneric';
import useDndDropOrderSaveFunctions from '~/components/dnds/useDndDropOrderSaveFunctions';

import type { Value } from '@prisma/client'
import useFetcherState from '~/components/utilities/useFetcherState';
import useServerMessages from '~/components/modals/useServerMessages';


interface Props {
  passedValues: Value[] | undefined;
}

const DndValues = ({ passedValues }: Props) => {
  const fetcher = useFetcher();
  const [values, setValues] = useState<Value[]>([]);
  const { handleDragEnd, setItemsArrayInProperOrder } = useDndDropOrderSaveFunctions({ fetcher, sortableArray: values, setSortableArray: setValues })
  const { fetcherState, fetcherMessage, } = useFetcherState({ fetcher })
  useServerMessages({ fetcherMessage, fetcherState, isShowFailed: true })


  //initial load
  useEffect(() => {
    if (!passedValues) return
    setItemsArrayInProperOrder(passedValues)
  }, [passedValues, setItemsArrayInProperOrder])


  return (
    <>
      <PageTitle text='Values' />
      <DndAndSortableContexts
        handleDragEnd={handleDragEnd}
        sortableArray={values}
        isVertical={true}
      >
        <DndInfo />

        {values?.map((value) => {
          const title = (<>
            <span className="text-sm">{value.sortOrder + 1}</span>. {value.title}
          </>)

          return (
            <DndSortableGeneric
              key={value.id}
              id={value.id}
              description={value.description}
              title={title}
            />
          )
        })}
      </DndAndSortableContexts>
    </>
  )
}

export default DndValues

