import moment from 'moment'
import { format } from 'date-fns';
import React, { useCallback, useMemo } from 'react'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import { CreateToolTip } from '../../schedule/Scheduler';
import { Calendar, momentLocalizer, Views, } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import type { ScheduledItem } from '@prisma/client'
import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndTasks } from '~/types/routineTypes'
import type { DesireWithOutcomesAndAll } from '~/types/desireTypes';


const localizer = momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop(Calendar)

interface SchedulerProps {
  scheduledItems: ScheduledItem[] | undefined;
  miscAndSpecialLists: ListAndToDos[];
  miscAndSpecialRoutines: RoutineAndTasks[];
  desiresAndAll: DesireWithOutcomesAndAll[]
}


function Today({
  scheduledItems,
  miscAndSpecialLists,
  miscAndSpecialRoutines,
  desiresAndAll
}: SchedulerProps) {

  const defaultDate = useMemo(() => format(new Date(), 'yyyy-MM-dd'), [])

  //? ***********   CUSTOM PROPS   ***************** */
  const dayPropGetter = useCallback((date: Date) => {
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return {
        className: 'bg-primary/20'
      };
    }
    return {};
  }, []);

  function CustomEvent({ event: innerEvent, title }: any) {
    //  could get todos from description : listId?  access it here to display todos?
    return (
      <>
        {title && (
          <div className='font-medium'>{title}</div>
        )}
        <div className='text-xs'>
          {innerEvent.start && innerEvent.end ?
            `${innerEvent.start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${innerEvent.end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
            : 'No start and end times available'
          }
        </div>

      </>
    );

  }


  const eventPropGetter = useCallback(
    (event: object) => {
      // console.log('in event prop getter and event is ', event)
      // make bg based on descripton type
      return { className: 'bg-primary-content text-base-content' }  // colors scheduled events
    }, [])


  // function handleOnSelectEvent({ event: Object }: any) {
  //   console.log('in handle select list')
  // }


  // function handleDoubleClickEvent(
  //   event: any,
  //   e: React.SyntheticEvent<HTMLElement, Event>
  // ) {
  //   setDeleteEventBool(true)
  //   setEventToDelete(event as ScheduledItem | Omit<ScheduledList, 'createdAt' | 'updatedAt' | 'userId'>)
  // }


  function handleToolTipAccessor(event: any) {
    const result = CreateToolTip({ event, miscAndSpecialLists, miscAndSpecialRoutines, desiresAndAll })
    // console.log("🚀 ~ file: Today.tsx:96 ~ handleToolTipAccessor ~ result:", result)
    
    return result
    // return CreateToolTip({ event, miscAndSpecialLists, miscAndSpecialRoutines, desiresAndAll })
  }



  return (
    <>
 

      <div className="h-[600px]">
        <DragAndDropCalendar
          defaultDate={defaultDate}
          defaultView={Views.DAY}
          // dragFromOutsideItem={dragFromOutsideItem}
          events={scheduledItems}
          localizer={localizer}
          // onDropFromOutside={onDrdopFromOutside}
          // onDragOver={customOnDragOver}
          // onEventDrop={moveEvent}
          // onEventResize={resizeEvent}
          // resizable
          selectable
          toolbar={false}
          scrollToTime={new Date()}
          dayPropGetter={dayPropGetter}
          eventPropGetter={eventPropGetter}
          components={{
            event: CustomEvent,
          }}
          step={15}
          timeslots={4}
          onDrillDown={() => { }}
          // onSelectEvent={handleOnSelectEvent}
          // onDoubleClickEvent={handleDoubleClickEvent}
          tooltipAccessor={handleToolTipAccessor}

        />
      </div>
    </>
  )
}

export default Today



