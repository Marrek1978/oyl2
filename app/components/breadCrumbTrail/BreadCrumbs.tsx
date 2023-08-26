import { Link, useLocation } from '@remix-run/react'
import React from 'react'
import SubHeading12px from '../titles/SubHeading12px';

interface BreadCrumbProps {
  title: string;
  title2?: string;
  title3?: string;
}
function BreadCrumbs({ title, title2, title3 }: BreadCrumbProps) {

  const pathname = useLocation()

  let pathArray = pathname.pathname.split('/')
  let breadcrumbArray:string[] = []
  if (pathArray.length > 3) {
    breadcrumbArray = pathArray.slice(2)
    breadcrumbArray[1] = title
    breadcrumbArray[2] = title2 || breadcrumbArray[2]
  } 

  const linkColor = 'text-primary'
  const endColor = 'text-base-content'

  return (
    <div className="text-sm font-bold breadcrumbs items-baseline">
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