import React from 'react'

import type { ActionArgs } from '@remix-run/server-runtime'

export const action = async ({request}:ActionArgs) => {
    console.log('in action of app.routes.dash.desires.$desireId_.outcomes.edit.tsx')
    return null
}


function EditOutcomePage() {
  return (
    <div>dash.desires.$desireId_.outcomes.edit</div>
  )
}

export default EditOutcomePage