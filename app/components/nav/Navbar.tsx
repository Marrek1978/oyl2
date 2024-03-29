import { useEffect } from 'react'
import type { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData, Form } from "@remix-run/react";

import { themeChange } from 'theme-change'
import { useTheme } from '~/styles/ThemeContext';
import OutlinedBtn from '../buttons/OutlinedBtn';
import { getUser } from "~/models/session.server";
import { LogoutIcon, MoonIcon, SunIcon } from '~/components/utilities/icons';

import type { User } from '@prisma/client';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let user = await getUser(request);
  return user;
};


function Navbar() {
  const loadedData = useLoaderData()
  const user = loadedData as User
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'night';  //checks theme var , is true if 'winter' is selected

  useEffect(() => {
    themeChange(false)
    // 👆 false parameter is required for react project
  }, [])

  const darkBackground = isDark ? 'bg-base-100' : 'bg-base-content'

  return (
    <>
      <nav >
        <div className={`navbar p-8 h-24 
           ${darkBackground}
           shadow
           text-success justify-between  `
        }>
          <Link className="text-3xl tracking-wide" to="/" >
            <div className='flex gap-2 items-baseline  font-poppins font-bold'>
              {/* <div id='logo'>
                <img src='/gold_lion.png' alt='logo' className='w-14 h-14' />
              </div> */}
              <div className='text-success uppercase'>
                OYL
              </div>
              <div className='text-sm text-success'>Organize your life</div>
            </div>
          </Link>

          <div className='max-h-4 flex gap-8'>
            {user && (<span className=' text-md font-poppins font-normal '> Hi, {user.name} </span>)}
            <button onClick={toggleTheme} className="btn btn-ghost text-warning ">
              {isDark ? SunIcon : MoonIcon}
              {/* {isDark ? faSun : MoonIcon} */}
              <span className="ml-2">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>

          <div className='flex items-center' >
            {user && (
              <>
                <Form method="post" action="/logout">
                  <OutlinedBtn
                    text='Logout'
                    onClickFunction={() => { }}
                    icon={LogoutIcon}
                    daisyUIBtnColor='warning'
                  />
                </Form>
              </>
            )}

          </div>
        </div>
      </nav >
    </>
  )
}

export default Navbar