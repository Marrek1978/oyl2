import React from 'react'
import SubHeading16px from './SubHeading16px'

type Props = {
  text: string
}

function PageTitle({ text }: Props) {
  return (
    <>
      <div className='text-success '>
        <SubHeading16px text={text} />
      </div>
    </>
  )
}

export default PageTitle
