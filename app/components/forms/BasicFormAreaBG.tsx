import React from 'react'
import { GetHeaderBgColor } from '~/components/forms/GetHeaderBgColor';
import H2WithLink from '~/components/titles/H2WithLink';
import HeadingH2 from '~/components/titles/HeadingH2';

interface BasicFormAreaBGProps {
  children: React.ReactNode;
  title: string | React.ReactNode;
  maxWidth?: string;
  linkDestination?: string;
  linkColor?: string;
  linkText?: string;

}

function BasicFormAreaBG({ children, title, maxWidth = '800px', linkDestination, linkColor = 'primary', linkText }: BasicFormAreaBGProps) {

  const backgroundColor = GetHeaderBgColor()

  return (
    <div className={`
      bg-base-100 shadow-xl
      cursor-defaultshadow-lg
      w-full max-w-[${maxWidth}]
      min-w-[350px]
      max-h-full
      overflow-auto
       
    `}>

      {/* //**************HEADER *************** */}
      <div className={`
        w-full min-h-[72px]  px-8 pt-2 pb-3
        ${backgroundColor}
        flex items-center
        text-xl font-mont uppercase font-normal tracking-widest 
        text-primary-300
        overflow-ellipsis  
      `}>

        <div className='max-w-prose'>
          {linkDestination && linkText && (
            <H2WithLink
              title={title}
              linkDestination={linkDestination}
              linkColor={linkColor}
              linkText={linkText}
            />
          )}

          {!linkDestination || !linkText ? (
            <HeadingH2 text={title} />
          ) : null}

        </div>
      </div>
      {children}
    </div>
  )
}

export default BasicFormAreaBG