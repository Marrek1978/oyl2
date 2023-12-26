import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';

import H2WithLink from '~/components/titles/H2WithLink';
import TextProseWidth from '~/components/text/TextProseWidth';

import { useEffect, useState } from "react";

import type { Milestone } from "@prisma/client";
import type { MilestoneGroupsWithMilestones } from '~/types/milestoneTypes';
import useSetSortOrderToNewIndex from "../useSetSortOrderToNewIndex";
import type { HasSortOrder } from "~/types/genericDndArrayTypes";
import DndSortableStyling from "../DndSortableStyling";

type Props = {
  id: string;
  passedGroup: MilestoneGroupsWithMilestones
}

function DndMilestoneGroupsSortable<T extends HasSortOrder>({ id, passedGroup }: Props) {

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });

  const setSortOrderToNewIndex = useSetSortOrderToNewIndex<T>();
  const [isMilestones, setIsMilestones] = useState<boolean>(false);
  const [milestonesNoGroup, setMilestonesNoGroup] = useState<Milestone[]>();


  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  useEffect(() => {
    const passedMilestones: Milestone[] = passedGroup.milestones
    if (passedMilestones.length === 0) return
    const milestonesSorted: Milestone[] = passedMilestones.sort((a, b) => a.sortOrder - b.sortOrder);
    setMilestonesNoGroup(milestonesSorted)
    setIsMilestones(true)
  }, [passedGroup, setSortOrderToNewIndex])


  const title = (<>
    <span className="text-sm">{passedGroup.sortOrder + 1}</span>. {passedGroup.title}
  </>)


  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mt-0">
        <DndSortableStyling id={id} priorityStyling={''}>
          <H2WithLink
            h2Text={title}
            linkDestination={id}
            linkText={'Go To'}
            btnColorDaisyUI={'link'}
          />

          {isMilestones ? (<>
            <div className="
              w-full mt-4
              text-center   
            ">
              <ul className={`steps my-steps `}>
                {milestonesNoGroup?.map((milestone) => {
                  const completed = milestone.isComplete ? 'step-primary' : ''
                  const label = milestone.title
                  return (
                    <li key={milestone.id} className={`step ${completed} whitespace-nowrap max-w-[100px]  min-w-[100px] text-xs text-ellipsis px-2`}>
                      {label}
                    </li>
                  )
                })}
              </ul>
            </div>
          </>

          ) : (<>

            <div className="mt-1">
              <TextProseWidth
                text={passedGroup.description || ''}
              />
            </div>
          </>)}

        </DndSortableStyling>
      </div>
    </>
  )
}

export default DndMilestoneGroupsSortable
