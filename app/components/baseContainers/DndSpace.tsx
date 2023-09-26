import React from 'react'
import BasicTextAreaBG from './BasicTextAreaBG'

type Props = {
  children: React.ReactNode
  maxWidthPx?: string
  minWidthPx?: string
}

function DndSpace({ children, maxWidthPx = 'max', minWidthPx = '350px' }: Props) {

  const maxWidth = maxWidthPx === 'max' ? 'max-w-max' : `max-w-[${maxWidthPx}]`
  const minWidth = `min-w-[${maxWidthPx}]`


  return (
    <>
      <section className={`w-full ${maxWidth} ${minWidth}`} >
        <BasicTextAreaBG  >
          {children}
        </BasicTextAreaBG>
      </section >
    </>
  )
}

export default DndSpace