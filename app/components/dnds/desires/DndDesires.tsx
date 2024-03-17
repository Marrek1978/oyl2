import { useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react';

import DndInfo from '../DndInfo';
import DndSortableDesire from './DndSortableDesire';
import PageTitle from '~/components/headers/PageTitle';
import DndAndSortableContexts from '../DndAndSortableContexts';
import useDndDropOrderSaveFunctions from '../useDndDropOrderSaveFunctions';

import type { DesireWithValuesAndOutcomes } from '~/types/desireTypes'
import ToggleWithLabelAndGuideLineLink from '~/components/forms/inputs/ToggleWithLabelAndGuideLineLink';


interface Props {
  passedDesires: DesireWithValuesAndOutcomes[] | undefined;
  // passedDesires: DesireWithValues[] | undefined;
}

const DndDesires = ({ passedDesires }: Props) => {
  const fetcher = useFetcher();
  const [desires, setDesires] = useState<DesireWithValuesAndOutcomes[]>([]);
  const [isShowValues, setIsShowValues] = useState<boolean>(false);
  const [isShowOutcomes, setIsShowOutcomes] = useState<boolean>(false);

  const { handleDragEnd, setItemsArrayInProperOrder } = useDndDropOrderSaveFunctions({ fetcher, sortableArray: desires, setSortableArray: setDesires })

  //initial load
  useEffect(() => {
    if (!passedDesires) return
    setItemsArrayInProperOrder(passedDesires)
  }, [passedDesires, setItemsArrayInProperOrder])


  return (
    <>
      <PageTitle text='Desires' />
      <DndAndSortableContexts
        handleDragEnd={handleDragEnd}
        sortableArray={desires}
        isVertical={true}
      >
         <div className='w-full flex flex-col items-end mt-6'>
          <div className="checkbox-label-flex min-w-[130px] max-w-max ">
            <ToggleWithLabelAndGuideLineLink
              text='Show Values Served?'
              checkedState={isShowValues}
              handleCheckedState={() => setIsShowValues(!isShowValues)}
              toggleColorDaisyUI='secondary'
              labelWidthTailwindClass='w-56'
              isSecondaryInput={true}
            />
          </div>
          <div className="checkbox-label-flex min-w-[130px] max-w-max ">
            <ToggleWithLabelAndGuideLineLink
              text='Show Outcomes?'
              checkedState={isShowOutcomes}
              handleCheckedState={() => setIsShowOutcomes(!isShowOutcomes)}
              toggleColorDaisyUI='secondary'
              labelWidthTailwindClass='w-56'
              isSecondaryInput={true}
            />
          </div>

          <div className='shrink mt-4'>
            <DndInfo />
          </div>
        </div>

        {desires?.map((desire) => {
            const title = (<>
              <span className="text-sm">{desire.sortOrder + 1}</span>. {desire.title}
            </>)

          return (
            <DndSortableDesire
              key={desire.id}
              id={desire.id}
              title={title}
              linkTitle='Go to desire'
              passedDesire={desire}
              isShowValues={isShowValues}
              isShowOutcomes={isShowOutcomes}
            />
          )
        })}

      </DndAndSortableContexts>
    </>
  )
}

export default DndDesires

