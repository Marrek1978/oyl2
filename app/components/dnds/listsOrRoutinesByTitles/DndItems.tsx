import { useFetcher } from '@remix-run/react'
import React, { useEffect, useState } from 'react'

import DndInfo from '../DndInfo'
import DndSortableList from '../lists/DndSortableList'
import FormButtons from '~/components/buttons/FormButtons'
import DndAndSortableContexts from '../DndAndSortableContexts'
import BasicFormAreaBG from '~/components/forms/util/BasicFormAreaBG'
import useFetcherState from '~/components/utilities/useFetcherState'
import useServerMessages from '~/components/displays/modals/useServerMessages'
import useDndDropOrderSaveFunctions from '../useDndDropOrderSaveFunctions'

import type { HasSortOrder } from '~/types/genericDndArrayTypes'

interface Props<T extends HasSortOrder> {
  listItems: T[]
  listType?: string | null
  listOrRoutine?: 'List' | 'Routine'
}

function DndItemsForm<T extends HasSortOrder>({ listItems, listType = 'misc', listOrRoutine = 'List' }: Props<T>) {

  const fetcher = useFetcher();
  const [lists, setLists] = useState<T[]>(listItems);

  const { fetcherState, fetcherMessage, } = useFetcherState({ fetcher })
  useServerMessages({ fetcherMessage, fetcherState, isShowFailed: true })
  const { handleDragEnd, setItemsArrayInProperOrder } = useDndDropOrderSaveFunctions({ fetcher, sortableArray: lists, setSortableArray: setLists })


  useEffect(() => {
    if (!listItems) return
    setItemsArrayInProperOrder(listItems)
  }, [listItems, setItemsArrayInProperOrder])


  return (
    <>
      <BasicFormAreaBG h2Text={`Re-Order ${listType} ${listOrRoutine}s `}>
        <div className="form-control  p-8">
          <DndInfo />
          <DndAndSortableContexts
            handleDragEnd={handleDragEnd}
            sortableArray={lists}
            isVertical={true}
          >
            <div>
              {lists?.map((list) => {
                const title = (<> <span className="text-sm">{list.sortOrder + 1}</span>. {list.title}</>)
                return (
                  <DndSortableList
                    key={list.id}
                    id={list.id}
                    title={title}
                  />
                )
              })}
            </div>
          </DndAndSortableContexts>

          <div className='mt-6'>
            <FormButtons isShowSaveBtn={false} />
          </div>
        </div>
      </BasicFormAreaBG>

    </>
  )
}

export default DndItemsForm