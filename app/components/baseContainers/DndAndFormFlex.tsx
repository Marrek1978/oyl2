import React from 'react'
import BasicTextAreaBG from './BasicTextAreaBG'

type Props = {
  dnd: React.ReactNode
  form: React.ReactNode
  formMaxWidthPx?: string
}

function DndAndFormFlex({ dnd, form, formMaxWidthPx = '830px' }: Props) {
  return (
    <>
      <article className="flex gap-8 flex-wrap ">
        <section className='
          flex-1 w-full max-w-max 
          min-w-[350px] 
          lg:min-w-[450px] 
        '>
          <BasicTextAreaBG  >
            {dnd}
          </BasicTextAreaBG>
        </section>

        <section className={`flex-1 max-w-[830px] min-w-[350px] truncate`}>
          {form}
        </section>
      </article>
    </>
  )
}

export default DndAndFormFlex