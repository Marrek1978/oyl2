import React from 'react'
import H2WithLink from '../headers/H2WithLink'
import TextProseWidth from './TextProseWidth'
import HeadingH2 from '../headers/HeadingH2';

interface H2WithLinkAndProseParaProps {
  title: string;
  linkDestination?: string;
  linkText?: string;
  paragraph: string;
  isTextBtn?: boolean;
}

function H2WithLinkAndProsePara({ title, linkDestination, linkText, paragraph, isTextBtn = true }: H2WithLinkAndProseParaProps) {
  return (
    <>
      <div>
        {linkText && linkDestination ? (
          <H2WithLink
            h2Text={title}
            linkDestination={linkDestination}
            linkText={linkText}
          />
        ) : (
          <HeadingH2 text={title} />
        )}

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