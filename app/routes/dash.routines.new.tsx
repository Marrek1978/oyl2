import { parse } from 'querystring'
import { type ActionArgs } from '@remix-run/server-runtime'
import RoutineForm from '~/components/forms/RoutineForm'

import Modal from '~/components/modals/Modal'
import { requireUserId } from '~/models/session.server'
import { createRoutineAndTasks } from '~/models/routines.server'

export const action = async ({ request }: ActionArgs) => {
  try {
    const userId = await requireUserId(request);
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const routineTitle = parsedBody.routineTitle as string;
    // const projectId = parsedBody.projectIdNum as string;
    // const outcomeId = parsedBody.outcomeIdNum as string;
    const routineToDos = JSON.parse(parsedBody.routineToDosString as unknown as string);
    await createRoutineAndTasks({ userId, title: routineTitle, routineToDos})
    return ('Routine was created.')
  } catch (error) { throw error }

}

function NewRoutinePage() {
  return (
    <>
      <Modal onClose={() => { }} >
        <RoutineForm />
      </Modal>
    </>
  )
}

export default NewRoutinePage
