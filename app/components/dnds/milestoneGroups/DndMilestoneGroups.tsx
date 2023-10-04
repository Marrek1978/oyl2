import { useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react';

import DndInfo from '~/components/dnds/DndInfo';
import SubHeading16px from '~/components/titles/SubHeading16px';
import type { MilestoneGroupsWithMilestones } from '~/types/milestoneTypes'
import DndAndSortableContexts from '~/components/dnds/DndAndSortableContexts';
import useDndDropOrderSaveFunctions from '~/components/dnds/useDndDropOrderSaveFunctions';
import DndMilestoneGroupsSortable from '~/components/dnds/milestoneGroups/DndMilestoneGroupsSortable';


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
      <SubHeading16px text='Milestone Groups' />
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