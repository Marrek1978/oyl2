import { useFetcher } from '@remix-run/react';
import { useCallback, useEffect, useState } from 'react'

import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import Modal from '~/components/modals/Modal';
import { SuccessMessageTimeout } from '../../utilities/constants';
import PageTitle from '~/components/titles/PageTitle';
import SuccessMessage from '~/components/modals/SuccessMessage';
import useCustomSensors from '~/components/dnds/useCustomDndSensors';
import DndSortableValue from '~/components/dnds/values/DndSortableValue';
import { useGetAllMilestoneGroupsForOutcome } from '~/routes/dash.desires.$desireId_.outcomes_.$outcomeId_.milestonegroups';

import type { MilestoneGroup } from '@prisma/client'
import useResetSortOrder from '../useSetSortOrderToNewIndex';
import useInOrder from '~/components/dnds/useInOrder';
import DndGenericContext from '../DndGenericContext';




function DndMilestoneGroups() {


  //  load array, check sort order, set state array in proper order on initial render
  // const fetcher = useFetcher();
  // const [successMessage, setSuccessMessage] = useState('');
  const [groups, setGroups] = useState<MilestoneGroup[]>([]);
  // const [saveNewSortOrder, setSaveNewSortOrder] = useState<boolean>(false);

  const loadedGroups: MilestoneGroup[] | undefined = useGetAllMilestoneGroupsForOutcome()
  // const inOrder = useInOrder()
  // const sensors = useCustomSensors();
  // const reOrderItems = useResetSortOrder()


  useEffect(() => {
    if (!loadedGroups) return
    setGroups(loadedGroups)
  }, [loadedGroups])


  // const setStateArrayInProperOrder = useCallback((itemsArray: MilestoneGroup[]) => {
  //   const isSequentialOrder: boolean = inOrder(itemsArray)
  //   if (isSequentialOrder) setGroups(itemsArray)
  //   if (!isSequentialOrder) {
  //     setGroups(reOrderItems(itemsArray))
  //     setSaveNewSortOrder(true)
  //   }
  // }, [reOrderItems, inOrder])


  // useEffect(() => {
  //   if (!loadedGroups) return
  //   setStateArrayInProperOrder(loadedGroups)
  // }, [loadedGroups, reOrderItems, setStateArrayInProperOrder])


  // useEffect(() => {
  //   if (fetcher.state === 'loading') {
  //     setSuccessMessage(fetcher.data);
  //     setTimeout(() => setSuccessMessage(''), SuccessMessageTimeout); // Clear the message after 3 seconds
  //   }
  // }, [fetcher])


  // const handleEditSortOrder = useCallback(async () => {
  //   const groupsString = JSON.stringify(groups);
  //   try {
  //     fetcher.submit({
  //       groupsString
  //     }, {
  //       method: 'PUT',
  //       // action: '/dash/values',
  //     })
  //   } catch (error) { throw error }
  //   setSaveNewSortOrder(false);
  // }, [groups, fetcher])


  // useEffect(() => {
  //   if (saveNewSortOrder) handleEditSortOrder()
  // }, [saveNewSortOrder, handleEditSortOrder])


  // function handleDragEnd(event: DragEndEvent) {
  //   const { active, over } = event;
  //   if (active.id !== over?.id) {
  //     setGroups((prevValues: MilestoneGroup[]) => {
  //       const oldIndex = prevValues.findIndex(value => value.id === active.id);
  //       const newIndex = prevValues.findIndex(value => value.id === over?.id);
  //       const newValues = arrayMove(prevValues, oldIndex, newIndex);
  //       setSaveNewSortOrder(true)
  //       return reOrderItems(newValues)
  //       // return handleReOrderGroups(newValues);
  //     })
  //   }
  // }


  return (
    <>
      {/* {successMessage && (
        <Modal onClose={() => { }} zIndex={20}>
          <SuccessMessage
            text={successMessage}
          />
        </Modal>)
      } */}

      {/* <PageTitle text='Milestone Groups' />
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={groups?.map(group => group.id)}
          strategy={verticalListSortingStrategy}
        >
          {groups?.map((group) => (
            <DndSortableValue
              key={group.id}
              id={group.id}
              description={group.description || ' '}
              title={group.title}
            />
          ))}

        </SortableContext> */}

      {/* </DndContext > */}


      <DndGenericContext<MilestoneGroup> passedArray={groups}  / >
       
    </>
  )
}


export default DndMilestoneGroups

