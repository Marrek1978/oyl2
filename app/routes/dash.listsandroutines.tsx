import { useEffect, useState } from 'react';
import type { LoaderFunctionArgs } from '@remix-run/server-runtime';
import { Link, Outlet, useRouteLoaderData } from '@remix-run/react';

import HeadingH2 from '~/components/titles/HeadingH2';
import { requireUserId } from '~/models/session.server';
import { getAllRoutines } from '~/models/routines.server';
import { getAllListsAndTodos } from '~/models/list.server';
import BtnWithProps from '~/components/buttons/BtnWithProps';
import SubHeading14px from '~/components/titles/SubHeading14px';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';
import { ArrayOfObjectsStrToDates, ObjectStrToDates } from '~/components/utilities/helperFunctions';

import type { HasSortOrder } from '~/types/genericDndArrayTypes';
import type { ListAndToDos, ListAndTodosWithStrDates } from '~/types/listTypes';
import type { RoutineAndTasks, RoutineAndTasksWithStrDates } from '~/types/routineTypes';
import DisplayListsOrRoutines from '~/components/list/DisplayListsOrRoutines';


export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const userId = await requireUserId(request);
    const allUserLists = await getAllListsAndTodos(userId)
    const allUserRoutines = await getAllRoutines(userId);
    return { allUserLists, allUserRoutines };
  } catch (error) {
    throw error
  }
}

function ListsPage() {

  const miscLists = useGetMiscLists();
  const miscRoutines = useGetMiscRoutines()
  const specialLists = useGetSpecialLists()
  const specialRoutines = useGetSpecialRoutines()

  return (
    <>
      <Outlet />
      <BasicTextAreaBG pageTitle='Lists and Routines'>
        <div className='flex flex-col mt-6 gap-y-12 w-full'>

          {/* //??   ***************    MISCELLANEOUS   *********************** */}
          <div className='flex flex-wrap gap-y-12 gap-x-16'>
            <div className='flex-1 min-w-[350px]  max-w-sm'>
              <div className='text-base-content/70'>
                <HeadingH2 text='Miscellaneous Lists' />
              </div>
              <div className='flex justify-end'>
                {miscLists.length > 0 && (
                  <Link to='lists?type=misc'>
                    <BtnWithProps
                      btnPurpose={'goto'}
                      btnLabel={'Re-order Misc Lists'}
                      fontWidthTW='bold'
                      textSizeTW='sm'
                    />
                  </Link>
                )}
              </div>
              <div className='flex justify-end'>
                <Link to='lists/new'>
                  <BtnWithProps
                    btnPurpose={'goto'}
                    btnLabel={'Create New Misc List'}
                    fontWidthTW='bold'
                    textSizeTW='sm'
                  />
                </Link>
              </div>
              <div className='mt-4 text-success'>
                <SubHeading14px text='Misc. Lists' />
              </div>
              <div className='mt-4'>
                <DisplayListsOrRoutines lists={miscLists} />
              </div>
            </div>


            <div className='flex-1 min-w-[350px]  max-w-sm'>
              <HeadingH2 text='Miscellaneous Routines' />
              <div className='flex justify-end'>
                {miscRoutines.length > 0 && (
                  <Link to='routines?type=misc'>
                    <BtnWithProps
                      btnPurpose={'goto'}
                      btnLabel={'Re-order Misc Routines'}
                      fontWidthTW='bold'
                      textSizeTW='sm'
                    />
                  </Link>
                )}
              </div>

              <div className='flex justify-end'>
                <Link to='routines/new'>
                  <BtnWithProps
                    btnPurpose={'goto'}
                    btnLabel={'Create New Misc Routine'}
                    fontWidthTW='bold'
                    textSizeTW='sm'
                  />
                </Link>
              </div>
              <div className='mt-4 '>
                <SubHeading14px text='Misc. Routines' />
              </div>
              <DisplayListsOrRoutines lists={miscRoutines} listType={'routine'} />
            </div>
          </div>


          {/* //??   ***************    SPECIAL *********************** */}
          <div className='flex flex-wrap gap-y-12 gap-x-16 '>

            <div className='flex-1 min-w-[350px]  max-w-sm'>
              <HeadingH2 text='Special Lists' />
              <div className='   flex justify-end'>
                <Link to='lists?type=special'>
                  <BtnWithProps
                    btnPurpose={'goto'}
                    btnLabel={'Re-order Special Lists'}
                    fontWidthTW='bold'
                    textSizeTW='sm'
                  />
                </Link>
              </div>

              <div className='mt-4 '>
                <SubHeading14px text='Special Lists' />
              </div>
              <DisplayListsOrRoutines lists={specialLists} />
            </div>


            <div className='flex-1 min-w-[350px]  max-w-sm'>
              <HeadingH2 text='Special Routines' />
              <div className='flex justify-end'>
                <Link to='routines?type=special'>
                  <BtnWithProps
                    btnPurpose={'goto'}
                    btnLabel={'Re-order Special Routines'}
                    fontWidthTW='bold'
                    textSizeTW='sm'
                  />
                </Link>
              </div>
              <div className='mt-4 '>
                <SubHeading14px text='Special Routines' />
              </div>
              <DisplayListsOrRoutines lists={specialRoutines} listType={'routine'} />
            </div>
          </div>


          <div>view Outcome lists and routines</div>
        </div>
      </BasicTextAreaBG >
    </>
  )
}

export default ListsPage


interface LoaderData {
  allUserLists: ListAndTodosWithStrDates[]
  allUserRoutines: RoutineAndTasksWithStrDates[]
}

// return { allUserLists, allUserRoutines };

export const useGetLoaders = () => {
  const path = 'routes/dash.listsandroutines'
  const loaderData = useRouteLoaderData(path)
  return loaderData;
  //{ allUserLists, allUserRoutines };
};


export const useGetMiscLists = (): ListAndToDos[] => {
  const loaderData = useGetLoaders();
  const [lists, setLists] = useState<ListAndToDos[]>([]);

  useEffect(() => {
    if (!loaderData) return;
    const data = loaderData as LoaderData
    const allListsWithStrDates = data.allUserLists as ListAndTodosWithStrDates[]
    const miscListsWithStrDates: ListAndTodosWithStrDates[] = allListsWithStrDates.filter((list: ListAndTodosWithStrDates) => list.outcomeId === null && list.isSpecialList === false)
    const miscListsWithProperDates: ListAndToDos[] = ChangeListArrayDates(miscListsWithStrDates)
    setLists(miscListsWithProperDates)
  }, [loaderData])
  return lists;
}


export const useGetMiscRoutines = (): RoutineAndTasks[] => {
  const loaderData = useGetLoaders(); //{ allUserLists, allUserRoutines };
  const [routines, setRoutines] = useState<RoutineAndTasks[]>([]);

  useEffect(() => {
    if (!loaderData) return;
    const data = loaderData as LoaderData
    let allRoutinesWithStrDates = data.allUserRoutines as RoutineAndTasksWithStrDates[]
    const miscRoutinesWithStrDates: RoutineAndTasksWithStrDates[] = allRoutinesWithStrDates.filter((routine: RoutineAndTasksWithStrDates) => routine.outcomeId === null && routine.isSpecialRoutine === false)
    const miscRoutinesWithProperDates: RoutineAndTasks[] = ChangeListArrayDates(miscRoutinesWithStrDates, 'routine')
    setRoutines(miscRoutinesWithProperDates)
  }, [loaderData])
  return routines;
}

export const useGetSpecialLists = (): ListAndToDos[] => {
  const loaderData = useGetLoaders();
  const [lists, setLists] = useState<ListAndToDos[]>([]);
  useEffect(() => {
    if (!loaderData) return;
    const data = loaderData as LoaderData
    const allListsWithStrDates = data.allUserLists as ListAndTodosWithStrDates[]
    const specialListsWithStrDates: ListAndTodosWithStrDates[] = allListsWithStrDates.filter((list: ListAndTodosWithStrDates) => list.outcomeId === null && list.isSpecialList === true)
    const specialListsWithProperDates: ListAndToDos[] = ChangeListArrayDates(specialListsWithStrDates)
    setLists(specialListsWithProperDates)
  }, [loaderData])
  return lists;
}




export const useGetSpecialRoutines = (): RoutineAndTasks[] => {
  const loaderData = useGetLoaders(); //{ allUserLists, allUserRoutines };
  const [routines, setRoutines] = useState<RoutineAndTasks[]>([]);
  useEffect(() => {
    if (!loaderData) return;
    const data = loaderData as LoaderData
    const allRoutinesWithStrDates = data.allUserRoutines as RoutineAndTasksWithStrDates[]
    const specialRoutinesWithStrDates: RoutineAndTasksWithStrDates[] = allRoutinesWithStrDates.filter((routine: RoutineAndTasksWithStrDates) => routine.outcomeId === null && routine.isSpecialRoutine === true) || []
    const specialRoutinesWithProperDates: RoutineAndTasks[] = ChangeListArrayDates(specialRoutinesWithStrDates, 'routine')
    setRoutines(specialRoutinesWithProperDates)
  }, [loaderData])

  return routines;
}



export const ChangeListArrayDates = <T extends HasSortOrder>(filteredLists: T[], type = 'list') => {
  const itemType = type === 'list'
    ? 'todos'
    : type === 'routine' ? 'tasks'
      : ''
  const dateKeysArray = type === 'list'
    ? ['createdAt', 'updatedAt', 'dueDate']
    : type === 'routine' ? ['createdAt', 'updatedAt']
      : []

  return filteredLists.map((list: T) => {
    const listWithProperDates = ObjectStrToDates({ item: list, dateKeys: ['createdAt', 'updatedAt'] })
    let listItemsWithProperDates: T[] = []
    listItemsWithProperDates = ArrayOfObjectsStrToDates({ items: list[itemType], dateKeys: dateKeysArray })

    return { ...listWithProperDates, todos: listItemsWithProperDates }
  })
}
