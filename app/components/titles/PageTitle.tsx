import React from 'react'
import SubHeading16px from './SubHeading16px'

type Props = {
  text: string
}

function PageTitle({ text }: Props) {
  return (
    <>
      <div  >
        <SubHeading16px text={text} daisyUIColor={'success'} />
      </div>
    </>
  )
}

export default PageTitle
