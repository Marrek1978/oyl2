import type { ActionArgs } from '@remix-run/server-runtime'
import React from 'react'

export const action = async ({ request }: ActionArgs) => {
  return null
}
export default function NewRoutineForProjectPage() {

   //form to create new routine, associted to project


  return (
    <div>dash.projects.$projectId.new_routine</div>
  )
}
