import { Link } from '@remix-run/react'
import { useEffect, useState } from 'react'

import useIsInOrder from '../dnds/useInOrder'
import BtnWithProps from '../buttons/BtnWithProps'
import Heading16pxWithLink from '../headers/Heading16pxWithLink'
import ListRoutineCard from '../baseContainers/ListRoutineCard'
import useSetSortOrderToNewIndex from '../dnds/useSetSortOrderToNewIndex'

import type { ListAndToDos, ListArrayTypes } from '~/types/listTypes'
import type { RoutineAndTasks } from '~/types/routineTypes'


type Props = {
  lists: ListArrayTypes,
  listType?: 'list' | 'routine' | 'filtered'
}


function DisplayListsOrRoutines({ lists, listType = 'list' }: Props) {
  const inOrder = useIsInOrder()
  const setSortOrderToNewIndex = useSetSortOrderToNewIndex();
  const [orderedLists, setOrderedLists] = useState<ListArrayTypes>([])

  const listTypeURL = listType === 'list' ? 'lists' : 'routines'

  useEffect(() => {
    if (!lists) return
    const isInOrder = inOrder(lists)
    if (isInOrder) setOrderedLists(lists)

    const reOrderedItemsArray = setSortOrderToNewIndex(lists)

    if (listTypeURL === 'lists') setOrderedLists(reOrderedItemsArray as ListAndToDos[])
    if (listTypeURL === 'routines') setOrderedLists(reOrderedItemsArray as | RoutineAndTasks[])
  }, [lists, inOrder, setSortOrderToNewIndex, listTypeURL])



  return (
    <>
      <div className='mt-2 max-w-sm'>
        {orderedLists.map((list) => {
          const listTitle = list.title
          const listId = list.id
          const linkDestination = `${listTypeURL}/${listId}`
          const linkText = `View ${listType}`

          return (
            < div key={listId} className="mt-0 capitalize relative group" >
              <div className="hidden group-hover:block z-30 absolute top-6 left-12"  >
                <ListRoutineCard list={list} />
              </div>
              <div className={` flex flex-wrap justify-between  items-baseline gap-x-4 w-full`} >
                <div className='flex-1 flex gap-2 items-baseline 
                  truncate capitalize 
                  cursor-pointer
                  relative
                  '
                >
                  <Heading16pxWithLink text={listTitle} />
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

export default DisplayListsOrRoutines

