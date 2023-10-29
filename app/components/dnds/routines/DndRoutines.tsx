import { useEffect, useState } from 'react'
import { Link, useFetcher, useMatches, useParams } from '@remix-run/react';

import DndInfo from '~/components/dnds/DndInfo';
import PageTitle from '~/components/titles/PageTitle';
import BtnWithProps from '~/components/buttons/BtnWithProps';
import useFetcherState from '~/components/utilities/useFetcherState';
import useServerMessages from '~/components/modals/useServerMessages';
import DndAndSortableContexts from '~/components/dnds/DndAndSortableContexts';
import useDndDropOrderSaveFunctions from '~/components/dnds/useDndDropOrderSaveFunctions';

import type { RoutineAndTasks } from '~/types/routineTypes';
import DndSortableRoutine from './DndSortableRoutine';


type Props = {
  passedRoutines: RoutineAndTasks[] | undefined;
}

const DndRoutines = ({ passedRoutines }: Props) => {

  const params = useParams()
  const matches = useMatches();
  const fetcher = useFetcher();
  const [isIndexPage, setIsIndexPage] = useState(true);
  const [routines, setRoutines] = useState<RoutineAndTasks[]>([]);
  
  const { handleDragEnd, setItemsArrayInProperOrder } = useDndDropOrderSaveFunctions({ fetcher, sortableArray: routines, setSortableArray: setRoutines })
  const { fetcherState, fetcherMessage, } = useFetcherState({ fetcher })
  useServerMessages({ fetcherMessage, fetcherState, isShowFailed: true })
  
  const { desireId, outcomeId } = params

  useEffect(() => {
    if (!matches) return
    setIsIndexPage(matches.some(match => match.id === 'routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.routines._index'))
  }, [matches])


  //initial load
  useEffect(() => {
    if (!passedRoutines) return
    setItemsArrayInProperOrder(passedRoutines)
  }, [passedRoutines, setItemsArrayInProperOrder])


  return (
    <>
      <div className='flex justify-between gap-x-4 flex-wrap items-center '>
        <PageTitle text='Routines' />
        {!isIndexPage && (
          <Link to={`/dash/desires/${desireId}/outcomes/${outcomeId}/routines/`}  >
            <BtnWithProps
              btnPurpose={'goto'}
              btnLabel='Create New Routine'
              fontWidthTW='bold'
              textSizeTW='xs'
            />
          </Link>
        )}
      </div>

      <DndAndSortableContexts
        handleDragEnd={handleDragEnd}
        sortableArray={routines}
        isVertical={true}
      >

        <div className='mt-8'>
          <DndInfo />
        </div>

        {routines?.map((routine) => {
          const title = (<> <span className="text-sm">{routine.sortOrder + 1}</span>. {routine.title}</>)

          return ( 
            <DndSortableRoutine
              key={routine.id}
              id={routine.id}
              title={title}
            />
          )
        })}
      </DndAndSortableContexts>
    </>
  )
}

export default DndRoutines
