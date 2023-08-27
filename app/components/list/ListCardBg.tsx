import React from 'react'
import GetHeaderBgColor from '../forms/GetHeaderBgColor';
import Heading14pxWithLink from '../titles/Heading14pxWithLink';

type Props = {
  children: React.ReactNode;
  title: string | React.ReactNode;
  maxWidth?: string;
  listId: string;
}

function ListCardBg({ children, title, maxWidth = '800px', listId }: Props) {

  const backgroundColor = GetHeaderBgColor()

  return (
    <div className={`
      flex-[1_1_300px] 
      max-w-[${maxWidth}] min-w-[250px]
      bg-base-100 shadow-xl
      truncate
    `}>
      <div className={`
        w-full h-[48px] px-8
        ${backgroundColor}
        flex items-center
        text-sm font-mont uppercase font-normal tracking-widest 
        text-slate-300
      `}>
        <Heading14pxWithLink
          title={title?.toLocaleString() || ''}
          linkDestination={listId}
          linkColor={'text-info'}
          linkText={'OPEN'}
        />
      </div>
      {children}
    </div>
  )
}

export default ListCardBg