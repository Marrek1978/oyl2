import { useFetcher } from '@remix-run/react'
import React, { useEffect, useState } from 'react'

import DndInfo from '../DndInfo'
import DndSortableList from '../lists/DndSortableList'
import FormButtons from '~/components/forms/FormButtons'
import DndAndSortableContexts from '../DndAndSortableContexts'
import BasicFormAreaBG from '~/components/forms/BasicFormAreaBG'
import useFetcherState from '~/components/utilities/useFetcherState'
import useServerMessages from '~/components/modals/useServerMessages'
import useDndDropOrderSaveFunctions from '../useDndDropOrderSaveFunctions'

import type { HasSortOrder } from '~/types/genericDndArrayTypes'

interface Props<T extends HasSortOrder> {
  listItems: T[]
}

function DndItemsForm<T extends HasSortOrder>({ listItems }: Props<T>) {

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
      <BasicFormAreaBG h2Text='Re-Order Misc. Lists'>
        <div className="form-control gap-y-6 p-8">
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

          <FormButtons isShowSaveBtn={false} />
        </div>
      </BasicFormAreaBG>

    </>
  )
}

export default DndItemsForm