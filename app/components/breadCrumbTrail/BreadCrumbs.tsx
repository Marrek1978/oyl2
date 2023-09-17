import { Link, useLocation } from '@remix-run/react'
import React from 'react'
import SubHeading12px from '../titles/SubHeading12px';

interface BreadCrumbProps {
  secondCrumb?: string;
  title2?: string;
  title3?: string;
}
function BreadCrumbs({ secondCrumb, title2, title3 }: BreadCrumbProps) {

  const pathname = useLocation()
  let pathArray = pathname.pathname.split('/')
  let breadcrumbArray: string[] = pathArray.slice(2)
  // console.log('breadcrumbArray is ', breadcrumbArray)
  secondCrumb && (breadcrumbArray[1] = secondCrumb)
  title2 && (breadcrumbArray[4] = title2)

  const linkColor = 'text-primary'
  const endColor = 'text-base-content'

  return (
    <div className="text-sm font-bold breadcrumbs items-baseline ">
      {breadcrumbArray.length > 1 && (
        <ul>
          {breadcrumbArray.map((crumb, index) => {
            const link = pathArray.slice(0, (3 + index)).join('/')
            return (
              <li key={index} >
                {index < breadcrumbArray.length - 1
                  ? (
                    <Link to={link}>
                      <div className={linkColor}><SubHeading12px text={crumb} /> </div>
                    </Link>
                  )
                  :
                  (<div className={endColor}> <SubHeading12px text={crumb} /></div>)
                }
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default BreadCrumbs