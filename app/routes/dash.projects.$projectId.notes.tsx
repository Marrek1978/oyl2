import type { ActionArgs, LoaderArgs } from '@remix-run/server-runtime'
import React from 'react'

export const loader = async ({ request }: LoaderArgs) => {
  return null
}

export const action = async ({ request }: ActionArgs) => {
  return null
}


export default function AllProjectNotesPage() {
  return (
    <div>dash.projects.$projectId.notes</div>
  )
}
