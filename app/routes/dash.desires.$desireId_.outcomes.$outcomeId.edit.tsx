import React from 'react'

import type { ActionArgs, LoaderArgs } from '@remix-run/server-runtime'
import { Outlet } from '@remix-run/react'


export const loader = async ({ request, params }: LoaderArgs) => {

  console.log('in loader of app.routes.dash.desires.$desireId_.outcomes.edit.tsx')
return null
}
export const action = async ({ request }: ActionArgs) => {
  console.log('in action of app.routes.dash.desires.$desireId_.outcomes.edit.tsx')
  return null
}


function EditOutcomePage() {
  return (
    <>
      <Outlet />
      <div>dash.desires.$desireId_.outcomes.edit</div>
    </>
  )
}

export default EditOutcomePage