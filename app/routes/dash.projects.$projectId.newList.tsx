import type { ActionArgs } from '@remix-run/server-runtime'
import React from 'react'


export const action = async ({ request }: ActionArgs) => {
  return null
}


export default function NewListForProjectPage() {

  //form to create new list, associted to project

  return (
    <div>dash.projects.$projectId.newList</div>
  )
}

