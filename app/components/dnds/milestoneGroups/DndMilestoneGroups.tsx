import { useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react';

import DndInfo from '~/components/dnds/DndInfo';
import PageTitle from '~/components/headers/PageTitle';
import DndAndSortableContexts from '~/components/dnds/DndAndSortableContexts';
import useDndDropOrderSaveFunctions from '~/components/dnds/useDndDropOrderSaveFunctions';
import DndMilestoneGroupsSortable from '~/components/dnds/milestoneGroups/DndMilestoneGroupsSortable';

import type { MilestoneGroupsWithMilestones } from '~/types/milestoneTypes'

type Props = {
  groups: MilestoneGroupsWithMilestones[];
}

function DndMilestoneGroups({ groups }: Props) {

  const fetcher = useFetcher();
  const [groupsArray, setGroupsArray] = useState<any[]>([]);
  const { handleDragEnd, setItemsArrayInProperOrder } = useDndDropOrderSaveFunctions({ fetcher, sortableArray: groupsArray, setSortableArray: setGroupsArray })


  //initial load
  useEffect(() => {
    if (!groups) return
    setItemsArrayInProperOrder(groups)
  }, [groups, setItemsArrayInProperOrder])


  return (
    <>
      <PageTitle text='Milestone Groups' />
      <DndAndSortableContexts
        handleDragEnd={handleDragEnd}
        sortableArray={groupsArray}
        isVertical={true}
      >
        <DndInfo />
        {groupsArray?.map((item) => (
          <DndMilestoneGroupsSortable
            key={item.id}
            id={item.id}
            passedGroup={item}
          />
        ))}

      </DndAndSortableContexts>
    </>
  )
}

export default DndMilestoneGroups