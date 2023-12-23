import { useEffect, useState } from 'react'
import { Form, useFetcher } from '@remix-run/react';

import DndInfo from '../DndInfo';
import PageTitle from '~/components/titles/PageTitle';
import DndSavingsSortable from './DndSavingsSortable';
import DndAndSortableContexts from '../DndAndSortableContexts';
import useFetcherState from '~/components/utilities/useFetcherState';
import useServerMessages from '~/components/modals/useServerMessages';
import useDndDropOrderSaveFunctions from '../useDndDropOrderSaveFunctions';
import ToggleWithLabelAndGuideLineLink from '~/components/forms/ToggleWithLabelAndGuideLineLink';

import type { Savings } from '@prisma/client'
import InputLabelWithGuideLineLink from '~/components/forms/InputLabelWithGuideLineLink';
import { CoreValue } from '~/components/utilities/Guidelines';
import FormButtons from '~/components/forms/FormButtons';
import { useGetMonthlySavingsAmount } from '~/routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.savings';
import SubHeading14px from '~/components/titles/SubHeading14px';
import BtnWithProps from '~/components/buttons/BtnWithProps';
import SubHeading16px from '~/components/titles/SubHeading16px';
import { closeIcon } from '~/components/utilities/icons';

type Props = {
  passedSavings: Savings[]
}

function DndSavings({ passedSavings }: Props) {

  const [savings, setSavings] = useState<Savings[]>([]);
  const [isShowDescription, setIsShowDescription] = useState<boolean>(false);

  const fetcher = useFetcher();
  const { handleDragEnd, setItemsArrayInProperOrder } = useDndDropOrderSaveFunctions({ fetcher, sortableArray: savings, setSortableArray: setSavings })
  const { fetcherState, fetcherMessage, } = useFetcherState({ fetcher })
  useServerMessages({ fetcherMessage, fetcherState, isShowFailed: true })

  const monthlySavingsAmount = useGetMonthlySavingsAmount()

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
          <BtnWithProps btnPurpose={'goto'} textSizeTW={'sm'} fontWidthTW={'bold'} />
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


          //track months till paid her
          const today = new Date()
          const currentMonth = today.getMonth()
          const currentYear = today.getFullYear()

          const monthsLeft = (saving?.requiredAmount || 0 - saving?.savedAmount) / monthlySavingsAmount
          const monthsLeftRounded = monthsLeft.toFixed(2)



          return (
            <DndSavingsSortable
              key={saving.id}
              saving={saving}
              linkTitle={'Go to saving'}
              isShowDescription={isShowDescription}
              monthsLeft={monthsLeftRounded}
              currentMonth={currentMonth}
            />
          )
        })}
      </DndAndSortableContexts>
    </>
  )
}

export default DndSavings