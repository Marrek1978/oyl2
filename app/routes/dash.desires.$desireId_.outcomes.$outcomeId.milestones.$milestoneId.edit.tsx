import { Outlet } from '@remix-run/react'

function EditMilestonePage() {
  return (
    <>
    <Outlet />
    <div>dash.desires.$desireId_.outcomes.$outcomeId.milestones.$milestoneId.edit</div>
    </>
  )
}

export default EditMilestonePage