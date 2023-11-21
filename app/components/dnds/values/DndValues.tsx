import { useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react';

import DndInfo from '~/components/dnds/DndInfo';
import PageTitle from '~/components/titles/PageTitle';
import useFetcherState from '~/components/utilities/useFetcherState';
import useServerMessages from '~/components/modals/useServerMessages';
import DndSortableGeneric from '~/components/dnds/values/DndSortableGeneric';
import DndAndSortableContexts from '~/components/dnds/DndAndSortableContexts';
import useDndDropOrderSaveFunctions from '~/components/dnds/useDndDropOrderSaveFunctions';

import type { Value } from '@prisma/client'
import ToggleWithLabelAndGuideLineLink from '~/components/forms/ToggleWithLabelAndGuideLineLink';


interface Props {
  passedValues: Value[] | undefined;
}

const DndValues = ({ passedValues }: Props) => {
  const fetcher = useFetcher();
  const [values, setValues] = useState<Value[]>([]);
  const [isShowDescription, setIsShowDescription] = useState<boolean>(true);
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

        <div className='w-full flex flex-col items-end mt-6'>
          <div className="checkbox-label-flex min-w-[130px] max-w-max ">
            <ToggleWithLabelAndGuideLineLink
              text='Show Value Descriptions?'
              checkedState={isShowDescription}
              handleCheckedState={() => setIsShowDescription(!isShowDescription)}
              toggleColorDaisyUI='secondary'
              labelWidthTailwindClass='w-56'
              isSecondaryInput={true}

            />
          </div>

          <div className='shrink mt-4'>
            <DndInfo />
          </div>
        </div>

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
              isShowDescription={isShowDescription}
            />
          )
        })}
      </DndAndSortableContexts>
    </>
  )
}

export default DndValues

