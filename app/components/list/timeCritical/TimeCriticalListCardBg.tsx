import React from 'react'
import { GetHeaderBgColor } from '../../forms/GetHeaderBgColor';
import Heading14pxWithLink from '../../titles/Heading14pxWithLink';

import type { maxWidthTW } from '~/types/CSSTypes';

type Props = {
  children: React.ReactNode;
  title: string | React.ReactNode;
  maxWidthTailWindSize?: maxWidthTW;
  linkUrl: string;
}

function TimeCriticalTodoListCardBg({ children, title, maxWidthTailWindSize = 'max-w-md', linkUrl, }: Props) {

  const backgroundColor = GetHeaderBgColor()

  return (
    <div className={`
      flex-[1_1_300px] 
      ${maxWidthTailWindSize} min-w-[250px]
      bg-base-100 shadow-xl
      truncate
    `}>
      <div className={`
        w-full h-[48px] px-6
        ${backgroundColor}
        flex items-center
        text-sm font-mont uppercase font-normal tracking-widest 
        text-slate-200
      `}>
        <Heading14pxWithLink
          title={title?.toLocaleString() || ''}
          linkDestination={linkUrl}
          linkTextColorDaisyUI={'info'}
          linkText={'Open List'}
        />
      </div>
      {children}
    </div>
  )
}

export default TimeCriticalTodoListCardBg