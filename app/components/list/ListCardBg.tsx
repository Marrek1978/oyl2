import React from 'react'
import { GetHeaderBgColor } from '../baseContainers/GetHeaderBgColor';
import Heading14pxWithLink from '../headers/Heading14pxWithLink';
import Heading14px from '../headers/Heading14px';

type Props = {
  children: React.ReactNode;
  title: string | React.ReactNode;
  maxWidthTailWindSize?: string;
  linkUrl?: string;
}

function ListCardBg({ children, title, maxWidthTailWindSize = 'md', linkUrl }: Props) {



  const backgroundColor = GetHeaderBgColor()

  return (
    <div className={`
      w-full
      max-w-${maxWidthTailWindSize} min-w-[250px]
      bg-base-100 shadow-xl
      truncate
    `}>
      <div className={`
        w-full h-[48px] px-6
        ${backgroundColor}
        flex items-center
        text-sm font-mont uppercase font-normal tracking-widest 
        text-slate-300
      `}>
        {linkUrl ? (
          <Heading14pxWithLink
            title={title?.toLocaleString() || ''}
            linkDestination={linkUrl}
            linkTextColorDaisyUI={'info'}
            linkText={'OPEN'}
          />
        ):(
          <Heading14px text={title?.toLocaleString() || ''} />
        )}
      </div>
      {children}
    </div>
  )
}

export default ListCardBg