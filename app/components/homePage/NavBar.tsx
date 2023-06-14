import { Link } from '@remix-run/react'
import React from 'react'

function NavBar() {
  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link to='/' className="btn btn-ghost normal-case text-xl">Organize Your Life</Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><Link to='/login'>Login</Link></li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default NavBar