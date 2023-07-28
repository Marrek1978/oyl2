import { useFetcher, useLoaderData } from '@remix-run/react'
import { useCallback, useEffect, useState } from 'react'
import type { ProjectWithDesires, ProjectWithStringDates } from '~/types/projectTypes';

import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";
import Modal from '~/components/modals/Modal';
import SuccessMessage from '~/components/modals/SuccessMessage';
import HeadingH1 from '~/components/titles/HeadingH1';
import DndSortableProject from './DndSortableProject';


//  highlight currenly selected project at dash/projects/$projectId
//  highlihgt to project as current 'Focus'

function DndProjects() {

  const fetcher = useFetcher();
  const loadedProjects = useLoaderData();


  const [projects, setProjects] = useState<ProjectWithDesires[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [saveNewSortOrder, setSaveNewSortOrder] = useState<boolean>(false);


  useEffect(() => {
    if (loadedProjects?.projects) { setProjects(transformProjectDates(loadedProjects?.projects)) }
  }, [loadedProjects])


  function transformProjectDates(desires: ProjectWithStringDates[]) {
    return desires.map((desire: any) => ({
      ...desire,
      createdAt: new Date(desire.createdAt!),
      updatedAt: new Date(desire.updatedAt!),
    }));
  }


  useEffect(() => {
    if (fetcher.data?.status === 'success') {
      setSuccessMessage('Projects Order was saved');
      setTimeout(() => setSuccessMessage(''), 500);
    }
  }, [fetcher])


  const handleEditSortOrder = useCallback(async () => {
    const projectString = JSON.stringify(projects);
    try {
      fetcher.submit({
        projectString
      }, {
        method: 'POST',
      })
    } catch (error) { throw error }

    setSaveNewSortOrder(false);
  }, [projects, fetcher])


  useEffect(() => {
    if (saveNewSortOrder) {
      handleEditSortOrder()
    }
  }, [saveNewSortOrder, handleEditSortOrder])


  const resetProjectsSortOrder = (projects: ProjectWithDesires[]) => {
    const reOrdered = projects?.map((project, index) => {
      return {
        ...project,
        sortOrder: index
      }
    })
    setSaveNewSortOrder(true)
    return reOrdered
  }


  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setProjects((prevProjects: ProjectWithDesires[]) => {
        const oldIndex = prevProjects.findIndex(project => project.id === active.id);
        const newIndex = prevProjects.findIndex(project => project.id === over?.id);
        const newDesires = arrayMove(prevProjects, oldIndex, newIndex);
        return resetProjectsSortOrder(newDesires);
      })
    }
  }


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }))


  return (
    <>
      <>
        {successMessage && (
          <Modal onClose={() => { }} zIndex={20}>
            {successMessage}
            <SuccessMessage
              text={'Order was updated'}
            />
          </Modal>)
        }
        <div className=''></div>
        <HeadingH1 text={'Your Projects'} />
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <SortableContext
            items={projects?.map(project => project.id)}
            strategy={verticalListSortingStrategy}
          >
            {projects?.map((project) => (
              <DndSortableProject
                key={project.id}
                id={project.id}
                project={project}
              />
            ))}
          </SortableContext>
        </DndContext >
      </>
    </>
  )
}

export default DndProjects