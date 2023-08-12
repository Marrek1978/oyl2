import { useEffect } from 'react'
import { json } from "@remix-run/node";
import type { LoaderArgs } from '@remix-run/node';
import { getUserId } from "~/models/session.server";
import { Link, useLoaderData, Form } from "@remix-run/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

import { themeChange } from 'theme-change'
import { useTheme } from '~/styles/ThemeContext';
// import OutlinedBtnGold from '~/components/buttons/OutlinedBtnGold';
import OutlinedBtn from '../buttons/OutlinedBtn';
import { LogoutIcon } from '~/components/utilities/icons';

export const loader = async ({ request }: LoaderArgs) => {
  let userId = await getUserId(request);
  return json({ userId });
};


function Navbar() {
  const { user } = useLoaderData();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'night';  //checks theme var , is true if 'winter' is selected

  useEffect(() => {
    themeChange(false)
    // 👆 false parameter is required for react project
  }, [])

   const darkBackground = isDark ? 'bg-base-300' : 'bg-base-content'

  return (
    <>
      <nav >
        <div className={`navbar p-6 h-24 
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

          <div>
            {user && (<span className=' text-md font-poppins font-normal '> Hi, {user.name} </span>)}
            <button onClick={toggleTheme} className="flex items-center pl-6 pr-3 text-warning">
              <FontAwesomeIcon icon={isDark ? faSun : faMoon} size='lg' />
              {/* <span className="ml-2">{isDark ? 'Light Mode' : 'Dark Mode'}</span> */}
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