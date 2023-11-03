import { useEffect, useState } from 'react';

import Heading16px from '../titles/Heading16px';
import DraggableListItem from './DraggableListItem';
import SubHeading12px from '../titles/SubHeading12px';

import type { RoutineAndTasks } from '~/types/routineTypes';
import type { ListAndToDos } from '~/types/listTypes';
import type { OutcomeWithAll } from '~/types/outcomeTypes';

type Props = {
  selectedOutcome: OutcomeWithAll;
  handleDragStart: (event: any) => void;
  isMainFocus: boolean;
}

function SelectedOutcomeDraggables({ selectedOutcome, handleDragStart, isMainFocus }: Props) {

  const [selectedOutcomeLists, setSelectedOutcomeLists] = useState<ListAndToDos[]>()
  const [selectedOutcomeRoutines, setSelectedOutcomeRoutines] = useState<RoutineAndTasks[]>()


  const timeBlockStyle = isMainFocus ? 'projects-draggable-timeBlock-mainFocus' : 'projects-draggable-timeBlock-default'
  const style = isMainFocus ? 'project-draggable-mainfocus' : 'project-draggable-default'

  useEffect(() => {
    if (selectedOutcome.lists) setSelectedOutcomeLists(selectedOutcome.lists)
    if (selectedOutcome.routines) setSelectedOutcomeRoutines(selectedOutcome.routines)
  }, [selectedOutcome])



  return (
    <>
      <div className=" w-56 p-0 [&_li>*]:rounded-none text-left ">

        {selectedOutcomeRoutines && (
          <div className='mb-4'>
            <Heading16px text={'Routines'} />
          </div>
        )}

        {selectedOutcomeRoutines?.map((routine: RoutineAndTasks) => {
          return (
            <DraggableListItem
              key={routine.id}
              list={routine}
              handleDragStart={handleDragStart}
              style={style}
            />
          )
        })}


        {selectedOutcomeLists && (
          <>
            <div className='mt-6 mb-4'>
              <Heading16px text={'Lists'} />
            </div>

            <div
              className={`${timeBlockStyle} scheduler-draggableLists-common `}
              draggable="true"
              onDragStart={() => handleDragStart(selectedOutcome)}
            >
              <SubHeading12px text={'Time Block for'} />
              {selectedOutcome.title}
              <div className='text-sm'> (Auto loads All Lists)</div>
            </div>
          </>
        )}

        {selectedOutcomeLists?.map((list: ListAndToDos) => {
          return (
            <DraggableListItem
              key={list.id}
              list={list}
              handleDragStart={handleDragStart}
              style={style}
            />
          )
        })}

      </div>
    </>
  )
}

export default SelectedOutcomeDraggables