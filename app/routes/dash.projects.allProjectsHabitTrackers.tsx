import type { LoaderArgs, ActionArgs } from '@remix-run/server-runtime'
import React from 'react'

export const loader = async ({ request }: LoaderArgs) => {
  //load all Project_Habit_Trackers
  return null
}

export const action = async ({ request }: ActionArgs) => {
  // save - available each month
  // save order of Project_Habit_Trackers
  return null
}

export default function AllProjectsHabitTrackersPage() {
  return (
    <div>dash.projects.habitTrackers</div>
  )
}
