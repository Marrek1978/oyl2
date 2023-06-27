import React from 'react'
import { NavLink, useLocation } from '@remix-run/react'



const SideNav = () => {

  const location = useLocation();
  const isListPage = (
    location.pathname.includes('/dash/lists')
    || location.pathname.includes('/dash/todos')
    || location.pathname.includes('/dash/todos')
  );

  const isValues = (
    location.pathname.includes('/dash/values')
    || location.pathname.includes('/dash/desires')
  );
  // console.log('isListPage is:', isListPage); // logs the current URL path

  return (
    <>
      <nav >
        <ul id='side-nav' className="menu w-56 p-0 [&_li>*]:rounded-none">
          <li className="relative">
            <NavLink to='/dashboard/focus/daily/priorities/projects' end >
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className="">
            <NavLink to='/dash/lists' >
              <span>Lists</span>
            </NavLink>
          </li>

          {isListPage && (<>
            <li >
              <NavLink className='link__right'
                to='/dash/todos'
              >
                <span >Todos</span>
              </NavLink>
            </li>
            <li >
              <NavLink to='/dash/routines' end className='link__right '  >
                <span>Routines</span>
              </NavLink>
            </li>
          </>
          )}

          <li className="">
            <NavLink to='/' end >
              <span>Schedule</span>
            </NavLink>
          </li>

          <li className="">
            <NavLink to='/dashboard/todos' end >
              <span>Projects</span>
            </NavLink>
          </li>

          <li className="">
            <NavLink to='/dash/clarity' end >
              <span>Clarification Questions</span>
            </NavLink>
          </li>

          <li className="">
            <NavLink to='/dash/values' end  >
              <span>Values</span>
            </NavLink>
          </li>

          {isValues && (<>
            <li className="">
              <NavLink to='/dash/desires' end className='link__indent1'  >
                <span>Desires</span>
              </NavLink>
            </li>
            <li className="">
              <NavLink to='/dash/desires' end className='link__indent2'  >
                <span>Current Situation</span>
              </NavLink>
            </li>
            <li className="">
              <NavLink to='/dash/delta' end className='link__indent3'  >
                <span>Delta</span>
              </NavLink>
            </li>
          </>
          )}

          <li className="relative">
            <NavLink to='/dashboard/todos' end >
              <span>Vision Board</span>
            </NavLink>
          </li>

          <li className="relative">
            <NavLink to='/dashboard/todos' end  >
              <span>Current Focus</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default SideNav