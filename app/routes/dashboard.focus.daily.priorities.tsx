import { Outlet, useLoaderData } from '@remix-run/react';
import { redirect, type ActionArgs, type LoaderArgs } from '@remix-run/server-runtime'
import React from 'react'
import { deleteCompletedToDosFromList, deleteCompletedToDosFromPriorityList, getToDosWhere, getToDosWhereDueDate } from '~/models/list.server';
import { requireUserId } from '~/models/session.server';
import DashPrioritiesCard from '~/components/list/DashPrioritiesCard';
import { transformData } from '~/utils/functions';
import type { Todo } from '~/types/listTypes';
import DashPrioritiesChBoxModal from '~/components/modals/DashPrioritiesChBoxModal';


//loader
export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  //load urgent todos
  const urgentTodos = await getToDosWhere({ userId }, { urgent: true, complete: false });
  const importantTodos = await getToDosWhere({ userId }, { important: true, complete: false });
  const dueDateTodos = await getToDosWhereDueDate({ userId });

  return { urgentTodos, importantTodos, dueDateTodos }
}

export async function action({ request }: ActionArgs) {
  await requireUserId(request);

  const formData = await request.formData();
  //get id of todo
  const completedTodoIds = formData.getAll('completedTodoIds') as string[];

  //delete todo
  await deleteCompletedToDosFromPriorityList(completedTodoIds);
  return redirect(request.url);
}


function DashboardFocusDailyPrioritiesRoute() {

  const { urgentTodos, importantTodos, dueDateTodos } = useLoaderData<typeof loader>();
  const urgentTodosTransformed = transformData(urgentTodos)
  const importantTodosTransformed = transformData(importantTodos)
  const dueDateTodosTransformed = transformData(dueDateTodos)

  const [openPriorityModal, setOpenPriorityModal] = React.useState<string | null>('');
  const [priorityModalTitle, setPriorityModalTitle] = React.useState<string | null>('');
  const [priorityModalTodos, setPriorityModalTodos] = React.useState<Todo[] | null>([]);

  const today = new Date();
  today.setHours(0, 0, 0, 0)

  const dueTodayTodos = dueDateTodosTransformed.filter((todo: Todo) => {
    if (todo.dueDate === null) {
      return false; // exclude todos with null dueDate from the filtered array
    }
    const dueDate = todo.dueDate;
    dueDate.setHours(0, 0, 0, 0)
    return dueDate <= today
  });

  const dueTomorrowTodos = dueDateTodosTransformed.filter((todo: Todo) => {
    if (todo.dueDate === null) {
      return false; // exclude todos with null dueDate from the filtered array
    }
    const dueDate = todo.dueDate;
    dueDate.setHours(0, 0, 0, 0)
    return dueDate > today
  })

   const sortByDate = (todos: Todo[]) => {
    return todos.sort((a: Todo, b: Todo) => {
      if (a.dueDate === null) {
        return 1;
      }
      if (b.dueDate === null) {
        return -1;
      }
      return a.dueDate.getTime() - b.dueDate.getTime();
    })
  }

  const dueTodayTodosSorted = sortByDate(dueTodayTodos)
  const dueTomorrowTodosSorted = sortByDate(dueTomorrowTodos)
  const urgentTodosSorted = sortByDate(urgentTodosTransformed)
  const importantTodosSorted = sortByDate(importantTodosTransformed)



  return (
    <>
      <div className=' w-full text-3xl text-lightText font-nanum font-medium'>Dashboard Focus Daily Priorities</div>

      <div className='flex flex-wrap gap-6'>

        {dueTodayTodos.length > 0 && (
          <DashPrioritiesCard
            title='Due Today'
            htmlFor={'priorities-checkboxes-dueToday'}
            todos={dueTodayTodosSorted}
            onOpenFunction={() => { setOpenPriorityModal('dueToday') }}
            setPriorityModalTitle={setPriorityModalTitle}
            setPriorityModalTodos={setPriorityModalTodos}
            headerColor='bg-accent'
            textColor='text-accent-content'
            labelHoverColor='text-pink-900'
          />
        )}

        {urgentTodosTransformed.length > 0 && (
          <DashPrioritiesCard
            title='Urgent'
            htmlFor={'priorities-checkboxes-urgent'}
            todos={urgentTodosSorted}
            onOpenFunction={() => { setOpenPriorityModal('urgent') }}
            setPriorityModalTitle={setPriorityModalTitle}
            setPriorityModalTodos={setPriorityModalTodos}
            headerColor='bg-accent'
            textColor='text-accent-content'
            labelHoverColor='text-pink-900'
          />
        )}

        {importantTodosTransformed.length > 0 && (
          <DashPrioritiesCard
            title='Important'
            htmlFor={'priorities-checkboxes-important'}
            todos={importantTodosSorted}
            onOpenFunction={() => { setOpenPriorityModal('important') }}
            setPriorityModalTitle={setPriorityModalTitle}
            setPriorityModalTodos={setPriorityModalTodos}
            headerColor='bg-info'
            textColor='base-content'
            labelHoverColor='text-sky-600'
          />
        )}


        {dueTomorrowTodos.length > 0 && (
          <DashPrioritiesCard
            title='Coming Up'
            htmlFor={'priorities-checkboxes-comingUp'}
            todos={dueTomorrowTodosSorted}
            onOpenFunction={() => setOpenPriorityModal('comingUp')}
            setPriorityModalTitle={setPriorityModalTitle}
            setPriorityModalTodos={setPriorityModalTodos}
          />
        )}


      </div>

      <DashPrioritiesChBoxModal
        htmlFor={`priorities-checkboxes-${openPriorityModal}`}
        title={priorityModalTitle}
        todos={priorityModalTodos}
      />
      <div ><Outlet /></div>
    </>
  )
}

export default DashboardFocusDailyPrioritiesRoute