import React from 'react'
import TextProseWidth from './TextProseWidth'
import HeadingH2 from '../headers/HeadingH2';

type Props = {
  title: string;
  paragraph: string;
}

function H2WithProsePara({ title, paragraph }: Props) {
  return (
    <>
      <div className=' w-full'>
        <HeadingH2
          text={title}
        />
        <div className='mt-2 mr-12 para-color'>
          <TextProseWidth
            text={paragraph || ''}
          />
        </div>
      </div>
    </>
  )
}

export default H2WithProsePara
