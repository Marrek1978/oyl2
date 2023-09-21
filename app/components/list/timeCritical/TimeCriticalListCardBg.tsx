import React from 'react'
import { GetHeaderBgColor } from '../../forms/GetHeaderBgColor';
import Heading14pxWithLink from '../../titles/Heading14pxWithLink';

type Props = {
  children: React.ReactNode;
  title: string | React.ReactNode;
  maxWidthTailWindSize?: string;
  linkUrl: string;
  daisyUIBackgroundColor?: string;
  daisyUITextColor?: string;

}

function TimeCriticalTodoListCardBg({ children, title, maxWidthTailWindSize = 'md', linkUrl, daisyUIBackgroundColor, daisyUITextColor='text-base-300' }: Props) {

  let backgroundColor;
  !daisyUIBackgroundColor ? backgroundColor = GetHeaderBgColor() : backgroundColor = daisyUIBackgroundColor

  return (
    <div className={`
      flex-[1_1_300px] 
      max-w-${maxWidthTailWindSize} min-w-[250px]
      bg-base-100 shadow-xl
      truncate
    `}>
      <div className={`
        w-full h-[48px] px-6
        ${backgroundColor}
        flex items-center
        text-sm font-mont uppercase font-normal tracking-widest 
        ${daisyUITextColor}
      `}>
        <Heading14pxWithLink
          title={title?.toLocaleString() || ''}
          linkDestination={linkUrl}
          linkColor={'text-info'}
          linkText={'OPEN'}
        />
      </div>
      {children}
    </div>
  )
}

export default TimeCriticalTodoListCardBg