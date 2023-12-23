import { useEffect, useState } from 'react'
import { Link, useFetcher, useParams } from '@remix-run/react';

import DndInfo from '../DndInfo';
import PageTitle from '~/components/titles/PageTitle';
import DndSavingsSortable from './DndSavingsSortable';
import BtnWithProps from '~/components/buttons/BtnWithProps';
import DndAndSortableContexts from '../DndAndSortableContexts';
import SubHeading14px from '~/components/titles/SubHeading14px';
import SubHeading16px from '~/components/titles/SubHeading16px';
import useFetcherState from '~/components/utilities/useFetcherState';
import useServerMessages from '~/components/modals/useServerMessages';
import useDndDropOrderSaveFunctions from '../useDndDropOrderSaveFunctions';
import ToggleWithLabelAndGuideLineLink from '~/components/forms/ToggleWithLabelAndGuideLineLink';
import { useGetMonthlySavingsAmount } from '~/routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.savings';

import type { Savings } from '@prisma/client'

type Props = {
  passedSavings: Savings[]
}

function DndSavings({ passedSavings }: Props) {

  const [savings, setSavings] = useState<Savings[]>([]);
  const [isShowDescription, setIsShowDescription] = useState<boolean>(false);

  const params = useParams()
  const { desireId, outcomeId } = params

  const today = new Date()
  let runningDate = today
  const monthlySavingsAmount = useGetMonthlySavingsAmount()

  const fetcher = useFetcher();
  const { handleDragEnd, setItemsArrayInProperOrder } = useDndDropOrderSaveFunctions({ fetcher, sortableArray: savings, setSortableArray: setSavings })
  const { fetcherState, fetcherMessage, } = useFetcherState({ fetcher })
  useServerMessages({ fetcherMessage, fetcherState, isShowFailed: true })


  //initial load
  useEffect(() => {
    if (!passedSavings) return
    setItemsArrayInProperOrder(passedSavings)
  }, [passedSavings, setItemsArrayInProperOrder])


  return (
    <>
      <PageTitle text='Savings' />


      <div className='flex gap-2 mt-6 items-baseline'>
        <div className='flex-auto'>
          <SubHeading14px text={'Avg Monthly Contribution'} />
        </div>
        <div className='flex-auto'>
          <SubHeading16px text={`$${monthlySavingsAmount}`} daisyUIColor={'base-content'} />
        </div>
        <div className='flex-auto'>
          <Link to={`/dash/desires/${desireId}/outcomes/${outcomeId}/savings/monthlysavingsamt`}>
            <BtnWithProps btnPurpose={'goto'} textSizeTW={'sm'} fontWidthTW={'bold'} />
          </Link>
        </div>
      </div>



      <div className="checkbox-label-flex min-w-[130px] mt-8 justify-end   ">
        <ToggleWithLabelAndGuideLineLink
          text='Show Saving Descriptions?'
          checkedState={isShowDescription}
          handleCheckedState={() => setIsShowDescription(!isShowDescription)}
          toggleColorDaisyUI='secondary'
          labelWidthTailwindClass='w-56'
          isSecondaryInput={true}
        />
      </div>

      <DndAndSortableContexts
        handleDragEnd={handleDragEnd}
        sortableArray={savings}
        isVertical={true}
      >

        <div className='w-full flex flex-col items-end '>
          <div className='shrink mt-0'>
            <DndInfo />
          </div>
        </div>

        {savings?.map((saving) => {

          const monthsLeft = (saving?.requiredAmount || 0 - saving?.savedAmount) / monthlySavingsAmount
          runningDate = addDeciamlMonthsToDate(runningDate, monthsLeft)

          return (
            <DndSavingsSortable
              key={saving.id}
              saving={saving}
              linkTitle={'Edit Outcome Savings'}
              isShowDescription={isShowDescription}
              estCompDate={runningDate}
            />
          )
        })}
      </DndAndSortableContexts>
    </>
  )
}

export default DndSavings


const addDeciamlMonthsToDate = (date: Date, decimalMonths: number): Date => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysToAdd = Math.round(decimalMonths * daysInMonth)

  return new Date(year, month, day + daysToAdd)
}


