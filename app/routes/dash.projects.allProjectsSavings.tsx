import type { LoaderArgs, ActionArgs } from '@remix-run/server-runtime'
import React from 'react'

export const loader = async ({ request }: LoaderArgs) => {
  //load all required_projects_savings
  return null
}

export const action = async ({ request }: ActionArgs) => {
  // save - available each month
  // save order of required_projects_savings
  return null
}



export default function AllProjectsSavingsPage() {

  //input for available each month
  // dnd for priority order

  // cascaded down from today, showing how much is available each month
  //  and how much is required to be saved each month

  // saving object request total required and amount saved.  
  // cron job to update amount saved each month... add available amount to amount saved in order of priority

  return (
    <div>dash.projects.savings</div>
  )
}
