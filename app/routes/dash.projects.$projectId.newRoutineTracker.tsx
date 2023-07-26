import type { ActionArgs } from '@remix-run/server-runtime'
import React from 'react'


export const action = async ({ request }: ActionArgs) => {
  return null
}
export default function NewRoutineTrackerForProjectPage() {

    //modal form to create new routine tracker, associted to project
  return (
    <div>dash.projects.$projectId.newRoutineTracker</div>
  )
}
