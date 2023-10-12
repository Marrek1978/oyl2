import { useEffect, useState } from 'react'
import { Link, useFetcher } from '@remix-run/react';

import DndSortableList from './DndSortableList';
import DndInfo from '~/components/dnds/DndInfo';
import PageTitle from '~/components/titles/PageTitle';
import useFetcherState from '~/components/utilities/useFetcherState';
import useServerMessages from '~/components/modals/useServerMessages';
import DndAndSortableContexts from '~/components/dnds/DndAndSortableContexts';
import useDndDropOrderSaveFunctions from '~/components/dnds/useDndDropOrderSaveFunctions';

import type { List } from '@prisma/client';
import BtnWithProps from '~/components/buttons/BtnWithProps';


type Props = {
  passedLists: List[] | undefined;
}

const DndLists = ({ passedLists}: Props) => {
  const fetcher = useFetcher();
  const [lists, setLists] = useState<List[]>([]);
  const { handleDragEnd, setItemsArrayInProperOrder } = useDndDropOrderSaveFunctions({ fetcher, sortableArray: lists, setSortableArray: setLists })
  const { fetcherState, fetcherMessage, } = useFetcherState({ fetcher })
  useServerMessages({ fetcherMessage, fetcherState, isShowFailed: true })

  //initial load
  useEffect(() => {
    if (!passedLists) return
    setItemsArrayInProperOrder(passedLists)
  }, [passedLists, setItemsArrayInProperOrder])


  return (
    <>
      <div className='flex justify-between gap-x-4 flex-wrap items-center'>
        <PageTitle text='To-Do Lists' />
        <Link to={`/dash/desires/clngb3neo001oeqkox8i36911/outcomes/clnjg8eyr0029eqzwt17xu6no/lists/`}  >
          <BtnWithProps
            btnPurpose={'goto'}
            btnLabel='Create New List'
            fontWidthTW='bold'
            textSizeTW='sm'
          />
        </Link>
      </div>

      <DndAndSortableContexts
        handleDragEnd={handleDragEnd}
        sortableArray={lists}
        isVertical={true}
      >
        <DndInfo />

        {lists?.map((list) => {
          const title = (<>
            <span className="text-sm">{list.sortOrder + 1}</span>. {list.title}
          </>)

          return (
            <DndSortableList
              key={list.id}
              id={list.id}
              title={title}
            />
          )
        })}

      </DndAndSortableContexts>
    </>
  )
}

export default DndLists