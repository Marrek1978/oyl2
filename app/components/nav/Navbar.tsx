import React, { useEffect } from 'react'
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from '@remix-run/node';
import { getUserId } from "~/models/session.server";
import { json } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { themeChange } from 'theme-change'

import { useTheme } from '~/styles/ThemeContext';
import OutlinedBtnGold from '~/components/buttons/OutlinedBtnGold';
import { LogoutIcon } from '~/components/utilities/icons';

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
      <nav >
        <div className="navbar p-6 h-24 bg-base-content text-goldText justify-between  ">
          <Link className="text-3xl tracking-wide" to="/" >
            <div className='flex gap-2 uppercase font-nanum'>
              <div id='logo'>
                <img src='/gold_lion.png' alt='logo' className='w-14 h-14' />
              </div>
              <div className=''>
                OYL
                <div className='text-sm'>Organize your life</div>
              </div>
            </div>
          </Link>

          {user && (<span className='text-base-200 text-md font-poppins font-normal '> Hi, {user.name} </span>)}
          <div className='flex items-center' >
            {user && (
              <>
                <Form method="post" action="/logout">
                  <OutlinedBtnGold
                    text='Logout'
                    onClickFunction={() => { }}
                    icon={LogoutIcon}
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