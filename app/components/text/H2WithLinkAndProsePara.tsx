import React from 'react'
import H2WithLink from '../titles/H2WithLink'
import TextProseWidth from './TextProseWidth'

interface H2WithLinkAndProseParaProps {
  title: string;
  linkDestination?: string;
  linkText: string;
  paragraph: string;
  isTextBtn?: boolean;
}

function H2WithLinkAndProsePara({ title, linkDestination, linkText, paragraph, isTextBtn=true }: H2WithLinkAndProseParaProps) {
  
  
  
  
  return (
    <>
      <div className='  '>
        <H2WithLink
          h2Text={title}
          linkDestination={linkDestination}
          linkText={linkText}
        />
        <div className='mt-2 mr-8 para-color  '>
          <TextProseWidth
            text={paragraph || ''}
          />
        </div>
      </div>
    </>
  )
}

export default H2WithLinkAndProsePara