import { parse } from 'querystring';
import type { ActionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal';
import { requireUserId } from '~/models/session.server';
import RoutineForm from '~/components/forms/RoutineForm';
import { createRoutineAndTasks } from '~/models/routines.server';
import { useGetMiscRoutines } from '~/routes/dash.listsandroutines';


export const action = async ({ request }: ActionArgs) => {

  if (request.method === 'POST') {
    const userId = await requireUserId(request);
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const title = parsedBody.title as string;
    const sortOrder = parsedBody.sortOrder ? parseInt(parsedBody.sortOrder as string) : 0;
    let tasks = [];
    if (parsedBody.tasksString) {
      tasks = JSON.parse(parsedBody.tasksString as string);
    }

    const outcomeId = parsedBody.outcomeId as string;
    try {
      await createRoutineAndTasks({ title, userId, tasks, outcomeId, sortOrder })
      return 'success'
    } catch (error) { return 'failed' }
  }
  return null
}



function NewRoutineList() {
  const nextSortOrder = GetMiscRoutinesArrayLength()

  return (
    <>
      <Modal zIndex={20}>
        <div className='modalFormWidth__lg'>
          <RoutineForm nextSortOrder={nextSortOrder} isNewInModal={true} isNew={true} isShowDeleteBtn={false} />
        </div>
      </Modal>
    </>
  )
}

export default NewRoutineList


export const GetMiscRoutinesArrayLength = () => {
  const miscRoutinesArray = useGetMiscRoutines()
  const miscRoutinesArrayLength = miscRoutinesArray.length
  return miscRoutinesArrayLength
}