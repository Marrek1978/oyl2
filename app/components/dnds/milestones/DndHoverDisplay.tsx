import Parser from 'html-react-parser';

import BasicFormAreaBG from '~/components/forms/BasicFormAreaBG';

import type { Milestone } from '@prisma/client';


type Props = {
  item: Milestone
  closeFunction?: () => void
}

function DndHoverDisplay({ item, closeFunction = () => { } }: Props) {
  const header = (
    <>
      {item.title}
      {item.dueDate && <span className='text-sm' >Due: {item.dueDate.toString()}</span>}
    </>)

  return (
    <div className='fixed left-1/2  top-1/2
      transform -translate-x-1/2 -translate-y-1/2 
      max-w-[780px] w-full  p-8  
      z-50
      whitespace-pre-line 
      zindex-[30]
      '>
      <BasicFormAreaBG title={header} >
        <section className='m-8 flex flex-col gap-8'>
          {item.description && (
            <div> {Parser(item.description)}</div>
          )}

          {item.isComplete ? (
            <div className='text-secondary'> Completed on: {item.completedAt?.toString()}</div>
          ) : (<div className='text-base-content'>Not yet Completed</div>)}
        </section>
      </BasicFormAreaBG>
    </div>
  )
}

export default DndHoverDisplay