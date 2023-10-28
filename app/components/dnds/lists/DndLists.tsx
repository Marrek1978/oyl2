import { useEffect, useState } from 'react'
import { Link, useFetcher, useMatches, useParams } from '@remix-run/react';

import DndSortableList from './DndSortableList';
import DndInfo from '~/components/dnds/DndInfo';
import PageTitle from '~/components/titles/PageTitle';
import BtnWithProps from '~/components/buttons/BtnWithProps';
import useFetcherState from '~/components/utilities/useFetcherState';
import useServerMessages from '~/components/modals/useServerMessages';
import DndAndSortableContexts from '~/components/dnds/DndAndSortableContexts';
import useDndDropOrderSaveFunctions from '~/components/dnds/useDndDropOrderSaveFunctions';

import type { ListAndToDos } from '~/types/listTypes';


type Props = {
  passedLists: ListAndToDos[] | undefined;
}

const DndLists = ({ passedLists }: Props) => {
  const params = useParams()
  const { desireId, outcomeId } = params
  const matches = useMatches();
  const fetcher = useFetcher();
  const [lists, setLists] = useState<ListAndToDos[]>([]);
  const [isIndexPage, setIsIndexPage] = useState(true);
  const { handleDragEnd, setItemsArrayInProperOrder } = useDndDropOrderSaveFunctions({ fetcher, sortableArray: lists, setSortableArray: setLists })
  const { fetcherState, fetcherMessage, } = useFetcherState({ fetcher })
  useServerMessages({ fetcherMessage, fetcherState, isShowFailed: true })


  useEffect(() => {
    if (!matches) return
    setIsIndexPage(matches.some(match => match.id === 'routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.lists._index'))
  }, [matches])


  //initial load
  useEffect(() => {
    if (!passedLists) return
    setItemsArrayInProperOrder(passedLists)
  }, [passedLists, setItemsArrayInProperOrder])


  return (
    <>
      <div className='flex justify-between gap-x-4 flex-wrap items-center '>
        <PageTitle text='To-Do Lists' />
        {!isIndexPage && (
          <Link to={`/dash/desires/${desireId}/outcomes/${outcomeId}/lists/`}  >
            <BtnWithProps
              btnPurpose={'goto'}
              btnLabel='Create New List'
              fontWidthTW='bold'
              textSizeTW='xs'
            />
          </Link>
        )}
      </div>

      <DndAndSortableContexts
        handleDragEnd={handleDragEnd}
        sortableArray={lists}
        isVertical={true}
      >
        <div className='mt-4'>
          <DndInfo />
        </div>

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
      </DndAndSortableContexts>
    </>
  )
}

export default DndLists