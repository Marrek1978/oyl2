import React from 'react'
import BasicTextAreaBG from './BasicTextAreaBG'

type Props = {
  dnd: React.ReactNode
  form: React.ReactNode
  formMaxWidthPx?: string
}

function DndAndFormFlex({ dnd, form , formMaxWidthPx='830px'}: Props) {
  console.log("🚀 ~ file: DndAndFormFlex.tsx:11 ~ DndAndFormFlex ~ formMaxWidthPx:", formMaxWidthPx)
  return (
    <>
      <article className="flex gap-8 flex-wrap ">
        <section className='flex-1 w-full max-w-max min-w-[350px] '>
          <BasicTextAreaBG  >
            {dnd}
          </BasicTextAreaBG>
        </section>

        <section className={`flex-1 max-w-[` + formMaxWidthPx + `] min-w-[350px] truncate`}>
          {form}
        </section>
      </article>
    </>
  )
}

export default DndAndFormFlex