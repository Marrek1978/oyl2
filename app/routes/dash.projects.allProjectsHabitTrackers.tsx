import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/server-runtime'
import React from 'react'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  //load all Project_Habit_Trackers
  return null
}

export const action = async ({ request }: ActionFunctionArgs) => {
  // save - available each month
  // save order of Project_Habit_Trackers
  return null
}

export default function AllProjectsHabitTrackersPage() {
  return (
    <div>dash.projects.habitTrackers</div>
  )
}
