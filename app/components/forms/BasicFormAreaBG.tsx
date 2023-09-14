import React from 'react'
import {GetHeaderBgColor} from '~/components/forms/GetHeaderBgColor';
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

function BasicFormAreaBG({ children, title, maxWidth = '800', linkDestination, linkColor = 'primary', linkText }: BasicFormAreaBGProps) {

  const backgroundColor = GetHeaderBgColor()

  return (
    <div className={`
      bg-base-100 shadow-xl
      grid grid-cols-[minmax(300px,${maxWidth}px)]
      grid-rows-[min-content_1fr_min-content]
      cursor-defaultshadow-lg
      w-full
      max-h-full
      overflow-auto
    `}>
      <div className={`
        w-full min-h-[72px]  px-8 pt-2 pb-3
        ${backgroundColor}
        flex items-center
        text-xl font-mont uppercase font-normal tracking-widest 
        text-primary-300
        overflow-ellipsis  
      `}>

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
      {children}
    </div>
  )
}

export default BasicFormAreaBG