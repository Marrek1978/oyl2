import { useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react';

import DndInfo from '~/components/dnds/DndInfo';
import DndHabitsSortable from './DndHabitsSortable';
import PageTitle from '~/components/titles/PageTitle';
import useFetcherState from '~/components/utilities/useFetcherState';
import useServerMessages from '~/components/modals/useServerMessages';
import DndAndSortableContexts from '~/components/dnds/DndAndSortableContexts';
import useDndDropOrderSaveFunctions from '~/components/dnds/useDndDropOrderSaveFunctions';
import ToggleWithLabelAndGuideLineLink from '~/components/forms/ToggleWithLabelAndGuideLineLink';

import type { HabitWithStreaks } from '~/types/habitTypes';

type Props = {
  passedHabits: HabitWithStreaks[];// habits with Streaks
}

function DndHabits({ passedHabits }: Props) {
  const fetcher = useFetcher();
  const [habits, setHabits] = useState<HabitWithStreaks[]>([]);
  const [isShowDescription, setIsShowDescription] = useState<boolean>(false);
  const { handleDragEnd, setItemsArrayInProperOrder } = useDndDropOrderSaveFunctions({ fetcher, sortableArray: habits, setSortableArray: setHabits })
  const { fetcherState, fetcherMessage, } = useFetcherState({ fetcher })
  useServerMessages({ fetcherMessage, fetcherState, isShowFailed: true })

  //initial load
  useEffect(() => {
    if (!passedHabits) return
    setItemsArrayInProperOrder(passedHabits)
  }, [passedHabits, setItemsArrayInProperOrder])


  return (
    <>
      <PageTitle text='Habits' />
      <DndAndSortableContexts
        handleDragEnd={handleDragEnd}
        sortableArray={habits}
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

        {habits?.map((habit) => {
          const title = (<>
            <span className="text-sm">{habit.sortOrder + 1}</span>. {habit.title}
          </>)

          return (
            <DndHabitsSortable
              key={habit.id}
              id={habit.id}
              description={habit.description || ''}
              title={title}
              isShowDescription={isShowDescription}
              linkTitle={'Go to Habit'}
            />
          )
        })}
      </DndAndSortableContexts>
    </>
  )
}

export default DndHabits