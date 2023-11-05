import { useEffect, useState } from 'react';
import type { LoaderArgs } from '@remix-run/server-runtime';
import { Link, Outlet, useRouteLoaderData } from '@remix-run/react';

import HeadingH2 from '~/components/titles/HeadingH2';
import { requireUserId } from '~/models/session.server';
import { getAllRoutines } from '~/models/routines.server';
import { getAllListsAndTodos } from '~/models/list.server';
import BtnWithProps from '~/components/buttons/BtnWithProps';
import SubHeading14px from '~/components/titles/SubHeading14px';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';
import DisplayListsWithHoverToDos from '~/components/list/DisplayListsWithHoverToDos';
import { ArrayOfObjectsStrToDates, ObjectStrToDates } from '~/components/utilities/helperFunctions';


import type { HasSortOrder } from '~/types/genericDndArrayTypes';
import type { ListAndToDos, ListAndTodosWithStrDates } from '~/types/listTypes';
import type { RoutineAndTasks, RoutineAndTasksWithStrDates } from '~/types/routineTypes';



export const loader = async ({ request }: LoaderArgs) => {
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

  return (
    <>
      <Outlet />
      <BasicTextAreaBG pageTitle='Lists and Routines'>
        <div className='flex flex-col mt-6 gap-y-12 w-full'>


          {/* //??   ***************    MISC LISTS *********************** */}
          <div className='flex flex-wrap gap-x-24'>
            <div className='flex-1 basis-96 max-w-sm'>
              <HeadingH2 text='Miscellaneous Lists' />
              <div className='max-w-max mt-2'>
                <Link to='misclists'>
                  <BtnWithProps
                    btnPurpose={'goto'}
                    btnLabel={'Re-order Misc Lists'}
                    fontWidthTW='bold'
                    textSizeTW='sm'
                  />
                </Link>
              </div>
              <div className='max-w-max mt-0'>
                <Link to='misclists/new'>
                  <BtnWithProps
                    btnPurpose={'goto'}
                    btnLabel={'Create New Misc List'}
                    fontWidthTW='bold'
                    textSizeTW='sm'
                  />
                </Link>
              </div>
              <div className='mt-4 '>
                <SubHeading14px text='Misc. Lists' />
              </div>
              <DisplayListsWithHoverToDos lists={miscLists} />
            </div>


            <div className='flex-1  basis-96'>
              <HeadingH2 text='Miscellaneous Routines' />
              <div className='max-w-max mt-2'>
                <Link to='misclists'>
                  <BtnWithProps
                    btnPurpose={'goto'}
                    btnLabel={'Re-order Misc Lists'}
                    fontWidthTW='bold'
                    textSizeTW='sm'
                  />
                </Link>
              </div>
              <div className='max-w-max mt-0'>

                <Link to='misclists/new'>
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
              <DisplayListsWithHoverToDos lists={miscRoutines} />
            </div>
          </div>


          {/* //??   ***************    SPECIAL LISTS *********************** */}
          <div>special lists - grocery,  purchases, yard work, house work - 
            others ppl can access these lists
          </div>
          <div className='flex flex-wrap gap-x-24'>
            <div className='flex-1 basis-96 max-w-sm'>
              <HeadingH2 text='Special Lists' />
              <div className='max-w-max mt-2'>
                <Link to='speciallists'>
                  <BtnWithProps
                    btnPurpose={'goto'}
                    btnLabel={'Re-order Misc Lists'}
                    fontWidthTW='bold'
                    textSizeTW='sm'
                  />
                </Link>
              </div>

              <div className='mt-4 '>
                <SubHeading14px text='Special Lists' />
              </div>
              <DisplayListsWithHoverToDos lists={miscLists} />
            </div>


            <div className='flex-1  basis-96'>
              <HeadingH2 text='Special Routines' />
              <div className='max-w-max mt-2'>
                <Link to='specialroutines'>
                  <BtnWithProps
                    btnPurpose={'goto'}
                    btnLabel={'Re-order Misc Lists'}
                    fontWidthTW='bold'
                    textSizeTW='sm'
                  />
                </Link>
              </div>
              <div className='mt-4 '>
                <SubHeading14px text='Special Routines' />
              </div>
              <DisplayListsWithHoverToDos lists={miscRoutines} />
            </div>
          </div>






          <div>view Outcome lists and routines</div>
        </div>
      </BasicTextAreaBG >
    </>
  )
}

export default ListsPage

export const useGetLoaders = () => {
  const path = 'routes/dash.listsandroutines'
  const loaderData = useRouteLoaderData(path);
  return loaderData;
  //{ allUserLists, allUserRoutines };
};


export const useGetMiscLists = (): ListAndToDos[] => {
  const { allUserLists } = useGetLoaders();//{ allUserLists, allUserRoutines };
  const [lists, setLists] = useState<ListAndToDos[]>([]);

  useEffect(() => {
    if (!allUserLists) return;
    const miscListsWithStrDates: ListAndTodosWithStrDates[] = allUserLists.filter((list: ListAndTodosWithStrDates) => list.outcomeId === null && list.isSpecialList === false)
    const miscListsWithProperDates: ListAndToDos[] = changeListDatesAndSortOrders(miscListsWithStrDates)
    setLists(miscListsWithProperDates)
  }, [allUserLists])
  return lists;
}


export const useGetSpecialLists = (): ListAndToDos[] => {
  const { allUserLists } = useGetLoaders();//{ allUserLists, allUserRoutines };
  const [lists, setLists] = useState<ListAndToDos[]>([]);

  useEffect(() => {
    if (!allUserLists) return;
    const miscSpecialListsWithStrDates: ListAndTodosWithStrDates[] = allUserLists.filter((list: ListAndTodosWithStrDates) => list.outcomeId === null && list.isSpecialList === true)
    const miscListsWithProperDates: ListAndToDos[] = changeListDatesAndSortOrders(miscSpecialListsWithStrDates)
    setLists(miscListsWithProperDates)
  }, [allUserLists])
  return lists;
}


export const changeListDatesAndSortOrders = <T extends HasSortOrder>(filteredLists: T[], type = 'list') => {
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





export const useGetMiscRoutines = (): RoutineAndTasks[] => {
  const { allUserRoutines } = useGetLoaders();//{ allUserLists, allUserRoutines };
  const [routines, setRoutines] = useState<RoutineAndTasks[]>([]);

  useEffect(() => {
    if (!allUserRoutines) return;
    const miscRoutinesWithStrDates: RoutineAndTasksWithStrDates[] = allUserRoutines.filter((routine: RoutineAndTasksWithStrDates) => routine.outcomeId === null && routine.isSpecialRoutine === false)
    const miscRoutinesWithProperDates: RoutineAndTasks[] = changeListDatesAndSortOrders(miscRoutinesWithStrDates)
    setRoutines(miscRoutinesWithProperDates)
  }, [allUserRoutines])

  return routines;
}


