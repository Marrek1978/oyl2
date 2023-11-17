import React from 'react'
import BasicTextAreaBG from './BasicTextAreaBG'
import type { maxWidthTW } from '~/types/CSSTypes'

type Props = {
  dnd: React.ReactNode
  form: React.ReactNode
  formMaxWidthTW?: maxWidthTW | ''
  listMaxWidthTW?: maxWidthTW | ''
}

function DndAndFormFlex({ dnd, form, formMaxWidthTW = 'max-w-3xl', listMaxWidthTW = '' }: Props) {
  return (
    <>
      <article className="flex gap-8 flex-wrap ">
        <section className={` 
          flex-1  w-full  
          ${listMaxWidthTW} 
          min-w-[350px] 
          lg:min-w-[450px] 
          `}>
          <BasicTextAreaBG  >
            {dnd}
          </BasicTextAreaBG>
        </section>

        <section className={`flex-1 ${formMaxWidthTW} min-w-[350px] truncate`}>
          {form}
        </section>
      </article>
    </>
  )
}

export default DndAndFormFlex