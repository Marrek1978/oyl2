import { Link, NavLink } from '@remix-run/react'
import React from 'react'

const SideNav = () => {
  return (
    <>

      <nav >

        <ul id='side-nav' className="menu  w-56 p-0 [&_li>*]:rounded-none">
          <li className="relative">
            <NavLink
              to='/dashboard' end
            >
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className="">
            <NavLink
              className='side-nav'
              to='/dashboard/todos' end
            >
              <span>To-Dos</span>
            </NavLink>
          </li>

          <li className="">
            <NavLink
              className='side-nav'
              to='/' end
            >
              <span>Schedule</span>
            </NavLink>
          </li>

          <li className="">
            <NavLink
              className='side-nav'
              to='/dashboard/todos' end
            >
              <span>Projects</span>
            </NavLink>
          </li>

          <li className="">
            <NavLink
              className='side-nav'
              to='/dashboard/todos' end
            >
              <span>Values</span>
            </NavLink>
          </li>

          <li className="relative">
            <NavLink
              className='side-nav'
              to='/dashboard/todos' end
            >
              <span>Vision Board</span>
            </NavLink>
          </li>

          <li className="relative">
            <NavLink
              className='side-nav'
              to='/dashboard/todos' end
            > 
              <span>Current Focus</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default SideNav