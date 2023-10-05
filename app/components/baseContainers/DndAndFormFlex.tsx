import React from 'react'
import BasicTextAreaBG from './BasicTextAreaBG'

type Props = {
  dnd: React.ReactNode
  form: React.ReactNode
}

function DndAndFormFlex({ dnd, form }: Props) {
  return (
    <>
      <article className="flex gap-8 flex-wrap ">
        <section className='flex-1 w-full max-w-max min-w-[350px] '>
          <BasicTextAreaBG  >
            {dnd}
          </BasicTextAreaBG>
        </section>

        <section className='flex-1 max-w-[830px] min-w-[350px]  '>
          {form}
        </section>
      </article>
    </>
  )
}

export default DndAndFormFlex