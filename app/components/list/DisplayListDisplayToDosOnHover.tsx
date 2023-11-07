import { Link } from '@remix-run/react'
import { useEffect, useState } from 'react'

import useIsInOrder from '../dnds/useInOrder'
import BtnWithProps from '../buttons/BtnWithProps'
import Heading16pxWithLink from '../titles/Heading16pxWithLink'
import useSetSortOrderToNewIndex from '../dnds/useSetSortOrderToNewIndex'

import type { Task, ToDo } from '@prisma/client'
import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndTasks } from '~/types/routineTypes'

type Props = {
  lists: ListAndToDos[] | RoutineAndTasks[]
  listType?: 'list' | 'routine'
}


function DisplayListDisplayToDosOnHover({ lists, listType='list' }: Props) {
  const [orderedLists, setOrderedLists] = useState<ListAndToDos[] | RoutineAndTasks[]>([])

  const inOrder = useIsInOrder()
  const setSortOrderToNewIndex = useSetSortOrderToNewIndex();

  const listTypeURL = listType === 'list' ? 'lists' : 'routines'

  useEffect(() => {
    if (!lists) return
    const isInOrder = inOrder(lists)
    if (isInOrder) setOrderedLists(lists)

    const reOrderedItemsArray = setSortOrderToNewIndex(lists)
    setOrderedLists(reOrderedItemsArray as ListAndToDos[] | RoutineAndTasks[])
  }, [lists, inOrder, setSortOrderToNewIndex])


  const CustomComponent = ({ listId }: { listId: string }) => {
    const itemProperty = 'todos' in lists[0] ? 'todos' : 'tasks'
    const list: (ListAndToDos | RoutineAndTasks | undefined) = lists.find(list => list.id === listId)
    if (!list) return null;

    const items = itemProperty === 'todos'
      ? (list as ListAndToDos)[itemProperty]
      : (list as RoutineAndTasks)[itemProperty];

    return (
      <div className=' absolute top-0 left-0  bg-white border-2 border-blue-500 w-56 h-56 text-base-content'>
        {items?.map((item: ToDo | Task) => {
          return (
            <div key={item.id}>
              <div className='mt-1'>{item.body}</div>
            </div>
          )
        })}
      </div>
    )
  }


  return (
    <>

      <div className='mt-2 max-w-sm'>
        {orderedLists.map((list) => {
          const listTitle = list.title
          const listId = list.id
          const linkDestination = `${listTypeURL}/${listId}`
          const linkText =`View ${listType}`

          return (
            < div key={listId} className="mt-0 capitalize relative group" >
              <div className={` flex flex-wrap justify-between  items-baseline gap-x-4 w-full`} >
                <div className='flex-1 flex gap-2 items-baseline truncate capitalize cursor-pointer'
                >
                  <Heading16pxWithLink text={listTitle} />
                  <div className="hidden group-hover:block z-10">
                    <CustomComponent listId={listId} />
                  </div>
                </div>
                <Link to={linkDestination} className='justify-end self-baseline  '>
                  <BtnWithProps
                    btnPurpose='goto'
                    btnLabel={linkText}
                    daisyUIBtnSize={'xs'}
                    fontWidthTW='bold'
                  />
                </Link>
              </div>
            </div >
          )
        })}
      </div>
    </>
  )
}

export default DisplayListDisplayToDosOnHover

