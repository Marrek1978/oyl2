import { Outlet } from '@remix-run/react'
import DndAndFormFlex from '~/components/baseContainers/DndAndFormFlex'
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs'
import ListForm from '~/components/forms/ListForm'

import type { ActionArgs } from '@remix-run/server-runtime';
import { requireUserId } from '~/models/session.server';
import { parse } from 'querystring';
import { createList} from '~/models/list.server';

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);
  const formBody = await request.text();
  const parsedBody = parse(formBody);

  const title = parsedBody.title as string;
  const todos = JSON.parse(parsedBody.todosString as string);
  const outcomeId = parsedBody.outcomeId as string;
  try {
    await createList({title, userId, todos, outcomeId })
    return 'success'
  } catch (error) { return 'failed' }
}



function OutcomeListsPage() {


  return (
    <>
      <BreadCrumbs secondCrumb={'Desire'} title2={'Outcome'} />
      <Outlet />
      <DndAndFormFlex
        dnd={<>dnd</>}
        form={<ListForm />}
        formMaxWidthPx='1200px'
      />

    </>
  )
}

export default OutcomeListsPage