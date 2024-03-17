import React from 'react'
import Parser from 'html-react-parser';

import HeadingH1 from '../headers/HeadingH1'
import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue';

interface basicTextAreaBGProps {
  children: React.ReactNode
  title: string
  closeFunction?: () => void
}

function BasicToolTipArea({ children, title, closeFunction = () => { } }: basicTextAreaBGProps) {
  return (
    <div className='fixed left-1/2  top-1/2
      transform -translate-x-1/2 -translate-y-1/2 
      max-w-[780px]  p-8 shadow-xl
      z-50
      whitespace-pre-line 
      text-neutral bg-neutral-content
      '>
      <HeadingH1 H1Title={title}  />
      {children && typeof children === 'string' && (
        Parser(children)
      )}

      <div className='mt-6'>
        <SolidBtnGreyBlue
          text='CLOSE'
          onClickFunction={closeFunction}
        />
      </div>
    </div>
  )
}

export default BasicToolTipArea