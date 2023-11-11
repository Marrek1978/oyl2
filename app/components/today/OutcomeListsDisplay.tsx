import { useEffect, useState } from 'react'
import CompletedTodosForm from '../forms/CompletedTodosForm'
import Heading16pxWithLink from '../titles/Heading16pxWithLink'
import DndSortableListStyling from '../dnds/DndSortableListStyling'

import type { ListAndToDos } from '~/types/listTypes'
import type { OutcomeWithAll } from '~/types/outcomeTypes'
import SubHeading16px from '../titles/SubHeading16px'


type Props = {
  outcome: OutcomeWithAll
}

function OutcomeListsDisplay({ outcome }: Props) {
  const [outcomeLists, setOutcomeLists] = useState<ListAndToDos[]>([])
  const [selectedList, setSelectedList] = useState<ListAndToDos>()

  useEffect(() => {
    if (!outcome.lists) return
    setOutcomeLists(outcome.lists)
    setSelectedList(outcome.lists[0])
  }, [outcome.lists])

  return (
    <>
      <div className='flex gap-12 flex-wrap mt-6'>
        <div className=''>
          <SubHeading16px text={`Lists for ${outcome.title} `} />
          <div className='flex-1 w-64 max-w-sm'>
            {outcomeLists?.map((list) => {
              const title = (<> <span className="text-sm">{list.sortOrder + 1}</span>. {list.title}</>)
              return (
                <div key={list.id}>
                  <DndSortableListStyling id={list.id}   >
                    <div className='
                  flex-1 flex gap-2 items-baseline truncate
                  capitalize cursor-pointer 
                  '
                      onClick={() => setSelectedList(list)}
                    >
                      <Heading16pxWithLink text={title} />
                    </div>
                  </DndSortableListStyling>
                </div>
              )
            })}
          </div>
        </div>
        <div>
          {selectedList && (
            <CompletedTodosForm list={selectedList} />
          )}
        </div>
      </div >
    </>
  )
}

export default OutcomeListsDisplay