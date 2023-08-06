import { useState } from 'react'
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";

import Modal from '~/components/modals/Modal';
import ProgressEvidenceItem from './ProgressEvidenceItem';
import EditProgressItemModal from '~/components/modals/EditProgressItemModal';

import type { DesireOutcomeProgress } from '@prisma/client';
import type { DragEndEvent } from "@dnd-kit/core";
import type { NewlyCreatedProgress } from '~/types/progressTypes';

interface DndProgressProps {
  progressList: DesireOutcomeProgress[] | NewlyCreatedProgress[]
  setProgressList: React.Dispatch<React.SetStateAction<DesireOutcomeProgress[] | NewlyCreatedProgress[]>>
}

function DndProgress({ progressList, setProgressList }: DndProgressProps) {
  const [openEditProgressItemModal, setOpenEditProgressItemModal] = useState<boolean>(false);
  const [progressItemToEdit, setProgressItemToEdit] = useState<DesireOutcomeProgress | NewlyCreatedProgress>();


  const resetProgressListSortOrder = (progressList: DesireOutcomeProgress[] | NewlyCreatedProgress[]) => {
    const reOrdered = progressList?.map((progress, index) => {
      return {
        ...progress,
        sortOrder: index
      }
    })
    return reOrdered
  }


  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setProgressList((prevProgressList: DesireOutcomeProgress[] | NewlyCreatedProgress[]) => {
        // setProgressListArray((prevProgressList: DesireOutcomeProgress[] | NewlyCreatedProgress[]) => {
        const oldIndex = prevProgressList.findIndex(progress => progress.id === active.id);
        const newIndex = prevProgressList.findIndex(progress => progress.id === over?.id);
        const newProgressList = arrayMove(prevProgressList, oldIndex, newIndex);
        return resetProgressListSortOrder(newProgressList);
      })
    }
  }


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }))


  function handleDeleteProgressItem(id: string) {
    setProgressList((prevProgressList: DesireOutcomeProgress[] | NewlyCreatedProgress[]) => {
      return prevProgressList.filter(progress => progress.id !== id)
    })
  }

  
  function handleOpenEditProgressItem(progress: DesireOutcomeProgress | NewlyCreatedProgress) {
    setProgressItemToEdit(progress)
    setOpenEditProgressItemModal(true)
  }


  function handleSaveEditProgressItem(editedProgressItem: DesireOutcomeProgress | NewlyCreatedProgress) {
    setProgressList((prevProgressList: DesireOutcomeProgress[] | NewlyCreatedProgress[]) => {
      const index = prevProgressList.findIndex(progress => progress.id === editedProgressItem.id)
      const newProgressList = [...prevProgressList]
      newProgressList[index] = editedProgressItem
      return newProgressList
    })
    setOpenEditProgressItemModal(false)
    setProgressItemToEdit(undefined)
  }

  return (
    <>
      {openEditProgressItemModal && progressItemToEdit && (
        <div className='max-w-max'>
          <Modal onClose={() => { }} zIndex={20}>
            <EditProgressItemModal
              progress={progressItemToEdit}
              handleSaveEdits={handleSaveEditProgressItem}
              handleCancel={() => setOpenEditProgressItemModal(false)}
            />
          </Modal>
        </div>
      )}

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={progressList.map((progress) => progress.id)}
          strategy={verticalListSortingStrategy}
        >
          {progressList?.map((progress) => {
            return (
              <ProgressEvidenceItem
                key={progress.id}
                id={progress.id}
                progress={progress}
                editProgressItem={handleOpenEditProgressItem}
                deleteProgressItem={handleDeleteProgressItem}
              />
            )
          })}

        </SortableContext>
      </DndContext >
    </>
  )
}

export default DndProgress