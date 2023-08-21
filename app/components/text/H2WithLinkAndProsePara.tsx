import React from 'react'
import H2WithLink from '../titles/H2WithLink'
import TextProseWidth from './TextProseWidth'

interface H2WithLinkAndProseParaProps {
  title: string;
  linkDestination: string;
  linkText: string;
  paragraph: string;
}

function H2WithLinkAndProsePara({ title, linkDestination, linkText, paragraph }: H2WithLinkAndProseParaProps) {
  return (
    <>
      <div className=' max-w-max'>
        <H2WithLink
          title={title}
          linkDestination={linkDestination}
          linkText={linkText}
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

export default H2WithLinkAndProsePara