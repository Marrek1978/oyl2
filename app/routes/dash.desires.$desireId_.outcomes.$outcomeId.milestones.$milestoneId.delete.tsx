import { Outlet } from '@remix-run/react'
import React from 'react'

function DeleteMilestonePage() {
  return (
    <>
      <Outlet />
      <div>dash.desires.$desireId_.outcomes.$outcomeId.milestones.$milestoneId.delete</div>
    </>
  )
}

export default DeleteMilestonePage