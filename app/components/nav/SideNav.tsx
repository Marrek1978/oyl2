import React from 'react'
import { NavLink, useLocation } from '@remix-run/react'



const SideNav = () => {

  const location = useLocation();
  const isListPage = (
    location.pathname.includes('/dash/alllists')
    || location.pathname.includes('/dash/lists')
    || location.pathname.includes('/dash/routines')
  );


  return (
    <>
      <nav >
        <ul id='side-nav' className="menu w-56 p-0 [&_li>*]:rounded-none">
          <li className="relative">
            <NavLink to='/dash/today' end >
              <span>Today</span>
            </NavLink>
          </li>

          <li className="">
            <NavLink to='/dash/schedule' end >
              <span>Schedule</span>
            </NavLink>
          </li>



          <li className="">
            <NavLink to='/dash/alllists' >
              <span>Lists & Routines</span>
            </NavLink>
          </li>

          {isListPage && (<>
            <li >
              <NavLink to='/dash/routines' end className='link__right '  >
                <span>Special Lists</span>
              </NavLink>
            </li>

            <li >
              <NavLink to='/dash/routines' end className='link__right '  >
                <span>Generic Routines</span>
              </NavLink>
            </li>

            <li >
              <NavLink className='link__right'
                to='/dash/lists'
              >
                <span >Generic Todos</span>
              </NavLink>
            </li>

          </>
          )}


          <li className="relative">
            <NavLink to='/dash' end  >
              <span>Current Focus</span>
            </NavLink>
          </li>


          {/* <li className="">
            <NavLink to='/dash/projects'  >
              <span>Projects</span>
            </NavLink>
          </li> */}


          <li className="relative">
            <NavLink to='/dash' end >
              <span>Vision Board</span>
            </NavLink>
          </li>


          <li className="">
            <NavLink to='/dash/desires'   >
              <span>Desires</span>
            </NavLink>
          </li>


          <li className="">
            <NavLink to='/dash/values'   >
              <span>Values</span>
            </NavLink>
          </li>


          <li className="">
            <NavLink to='/dash/clarity'  >
              <span>Clarify / Life Calendar</span>
            </NavLink>
          </li>

        </ul>
      </nav>
    </>
  )
}

export default SideNav