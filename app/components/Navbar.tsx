import React, { useEffect} from 'react'
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from '@remix-run/node';
import { getUserId } from "~/session.server";
import { json } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

// import { ClientOnly } from "remix-utils";
// import MyButtonOutlined from './MyButtonOutlined.client';
// import ThemeSwitcher from './ThemeSwitcher';
import { useTheme } from '~/styles/ThemeContext';

import { themeChange } from 'theme-change'
import OutlinedBtn from './buttons/OutlinedBtn';

export const loader = async ({ request }: LoaderArgs) => {
  let userId = await getUserId(request);
  return json({ userId });
};

function Navbar() {
  const { user } = useLoaderData();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'winter';  //checks theme var , is true if 'winter' is selected

  useEffect(() => {
    themeChange(false)
    // 👆 false parameter is required for react project
  }, [])

  return (
    <>
      <nav>
        <div className="navbar h-20 bg-base-content text-goldText justify-between ">
          <div className='flex gap-2 uppercase font-nanum'>
            <div id='logo'>
              <img src='/gold_lion.png' alt='logo' className='w-14 h-14' />
            </div>
            <div className=''>
              <Link className="
                  text-3xl tracking-wide"
                to="/"
              >OYL</Link>
              <div className='text-sm'>Organize your life</div>
            </div>
          </div>

          {user && (<span className='text-base-200 text-md font-poppins font-normal '> Hi, {user.name} </span>)}
          <div className='flex items-center' >
            {user && (
              <>
                <Form method="post" action="/logout">
                  <OutlinedBtn
                    text='Logout'
                    onClickFunction={() => { }}
                    daisyUIBtnColor='warning'
                  />
                </Form>
               
              </>
            )}

            <button onClick={toggleTheme} className="flex items-center pl-6 pr-3">
              <FontAwesomeIcon icon={isDark ? faSun : faMoon} size='lg' />
              {/* <span className="ml-2">{isDark ? 'Light Mode' : 'Dark Mode'}</span> */}
            </button>
          </div>
        </div>
      </nav >
    </>
  )
}

export default Navbar