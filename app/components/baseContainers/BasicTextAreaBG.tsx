import React from 'react'
import PageTitle from '../headers/PageTitle';

interface basicTextAreaBGProps {
  children: React.ReactNode
  pageTitle?: string;
}

function BasicTextAreaBG({ children, pageTitle }: basicTextAreaBGProps) {
  return (
    <div className='bg-base-100 p-8 w-full  '>
      <div style={{ whiteSpace: 'pre-line' }}>
        {pageTitle && (
          <PageTitle text={pageTitle} />
        )}
        {children}
      </div>
    </div>
  )
}

export default BasicTextAreaBG