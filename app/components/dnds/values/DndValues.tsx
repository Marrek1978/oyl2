import { useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react';


import DndSortableValue from './DndSortableValue';

import type { Value } from '@prisma/client'
import PageTitle from '~/components/titles/PageTitle';
import useDndDropOrderSaveFunctions from '../useDndDropOrderSaveFunctions';
import DndAndSortableContexts from '../DndAndSortableContexts';
import DndInfo from '../DndInfo';

interface Props {
  passedValues: Value[] | undefined;
}


const DndValues = ({ passedValues }: Props) => {

  const fetcher = useFetcher();
  const [values, setValues] = useState<Value[]>([]);
  const { handleDragEnd, setItemsArrayInProperOrder } = useDndDropOrderSaveFunctions({ fetcher, sortableArray: values, setSortableArray: setValues })


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

        {values?.map((value) => (
          <DndSortableValue
            key={value.id}
            id={value.id}
            description={value.description}
            title={value.title}
          />
        ))}
      </DndAndSortableContexts>
    </>
  )
}

export default DndValues

