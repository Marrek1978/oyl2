import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/server-runtime'
import React from 'react'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return null
}

export const action = async ({ request }: ActionFunctionArgs) => {
  return null
}


export default function AllProjectNotesPage() {
  return (
    <div>dash.projects.$projectId.notes</div>
  )
}
