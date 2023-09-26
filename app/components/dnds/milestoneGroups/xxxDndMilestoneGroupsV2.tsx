import { useEffect, useState } from 'react'

import DndGenericContext from '../DndGenericContext';
import { useGetAllMilestoneGroupsForOutcome } from '~/routes/dash.desires.$desireId_.outcomes_.$outcomeId_.milestonegroups';

import type { MilestoneGroup } from '@prisma/client'
import DndSortableValue from '../values/DndSortableValue';


function DndMilestoneGroupsv2() {

  const [groups, setGroups] = useState<MilestoneGroup[]>([]);
  const loadedGroups: MilestoneGroup[] | undefined = useGetAllMilestoneGroupsForOutcome()


  useEffect(() => {
    if (!loadedGroups) return
    setGroups(loadedGroups)
  }, [loadedGroups])


  return (
    <>
      <DndGenericContext<MilestoneGroup> array={groups} />
    </>
  )
}


export default DndMilestoneGroupsv2

