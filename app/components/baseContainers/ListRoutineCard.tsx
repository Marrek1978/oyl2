import { useEffect, useState } from 'react'

import ListCardBg from '../list/ListCardBg';

import type { Task, ToDo } from '@prisma/client';
import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndTasks } from '~/types/routineTypes'
import TaskTodoItem from './TaskTodoItem';

export type FilteredList = {
  title: string;
  todos: ToDo[]
}
// type ItemList = ListAndToDos | RoutineAndTasks | FilteredList
export type ActionItem = ToDo | Task

type Props = {
  list?: ListAndToDos | RoutineAndTasks | FilteredList
}


function ListRoutineCard({ list }: Props) {

  const [actionItemsType, setActionItemsType] = useState<'todos' | 'tasks'>()
  const [title, setTitle] = useState<string>()
  const [actionItems, setActionItems] = useState<ActionItem[]>()

  //unique links to list, routine, 

  useEffect(() => {
    if (!list || list === undefined || list === null) return
    console.log("🚀 ~ file: ListRoutineCard useEffect ~ list:", list)
    if ('id' in list && 'todos' in list) {
      setTitle(list.title);
      setActionItems(list.todos as ActionItem[]);
      setActionItemsType('todos');

    } else if ('id' in list && 'tasks' in list) {
      console.log('id and tasks')
      setTitle(list.title);
      setActionItems(list.tasks as ActionItem[]);
      setActionItemsType('tasks');

    } else if (!('id' in list) && 'todos' in list) {
      setTitle(list.title);
      setActionItems(list.todos as ActionItem[]);
      setActionItemsType('todos');
    }
  }, [list])


  return (
    <>
      <div className='absolute top-0 left-10 '>

        <ListCardBg
          title={title}
          maxWidthTailWindSize='md'
          linkUrl={''}
        >
          < div className="mx-6 my-4 max-h-32" >
            {actionItems?.map((item, index) => {
              return (
                <TaskTodoItem
                  key={index}
                  item={item}
                  actionItemsType={actionItemsType}
                />
              )
            })}
          </ div>
        </ListCardBg>
      </div>
    </>
  )
}

export default ListRoutineCard