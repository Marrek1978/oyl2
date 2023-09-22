import moment from 'moment'
import { format } from 'date-fns';
// import { v4 as uuidv4 } from 'uuid';
import React, { useCallback, useMemo } from 'react'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
 
import { Calendar, momentLocalizer, Views, } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndToDos } from '~/types/routineTypes'
import type { ListToDo, RoutineToDo, ScheduledList } from '@prisma/client'


const localizer = momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop(Calendar)

interface SchedulerProps {
  scheduledLists: ScheduledList[];
  loadedLists: ListAndToDos[];
  loadedRoutines: RoutineAndToDos[];
}


function Scheduler({
  scheduledLists,
  loadedLists,
  loadedRoutines,
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
  //   setEventToDelete(event as ScheduledList | Omit<ScheduledList, 'createdAt' | 'updatedAt' | 'userId'>)
  // }


  function handleToolTipAccessor(event: any) {
    const type = Object.keys(event.description)[0]
    const { listId } = event
    let loadedList: ListAndToDos[] | RoutineAndToDos[] = [];
    let currentList: ListAndToDos[] | RoutineAndToDos[] | undefined;
    let currentToDos: ListToDo[] | RoutineToDo[] | undefined;

    if (type === 'todos') {
      currentList = loadedLists?.filter((list: ListAndToDos) => list.id === listId);
      currentList && (currentToDos = currentList[0]?.[type])
    }

    if (type === 'routineToDos') {
      loadedList = loadedRoutines
      currentList = loadedList?.filter((list: RoutineAndToDos) => list.id === listId);
      currentList && (currentToDos = currentList[0]?.[type])
    }

    if (type === 'projectLists') {
      const titles = event.description[type].map((list: ListAndToDos) => list.title)
      return `\nLists:\n${titles.join('\n')}`
    }

    return `\nToDos:\n${currentToDos?.map((todo: any) => todo.body).join('\n')}`
  }



  return (
    <>
      {/* {successMessage && (
        <Modal onClose={() => { }} zIndex={30}>
          {successMessage}Yolo
          <SuccessMessage
            text='List was removed from Schedule'
          />
        </Modal>)
      } */}

      {/* {deleteEventBool && eventToDelete && (
        <Modal onClose={() => { }} zIndex={20}>
          <DeleteEventModal
            event={eventToDelete}
            setDeleteEventBool={setDeleteEventBool}
            setScheduledLists={setScheduledLists}
            setSuccessMessage={setSuccessMessage}
          />
        </Modal>
      )} */}

      <div className="h-[600px]">
        <DragAndDropCalendar
          defaultDate={defaultDate}
          defaultView={Views.DAY}
          // dragFromOutsideItem={dragFromOutsideItem}
          events={scheduledLists}
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

export default Scheduler



