import { useEffect, useState } from 'react';
import { redirect, type ActionArgs } from '@remix-run/server-runtime';
import { Outlet, useNavigate, useParams, useRouteLoaderData } from '@remix-run/react';

import Modal from '~/components/modals/Modal';
import { updateDesire } from '~/models/desires.server';
import { requireUserId } from '~/models/session.server';
import DesiresForm from '~/components/forms/DesiresForm';
import { transformDesireValueOutcomeDates } from '~/components/dnds/desires/DndDesires';

import type { DesireWithValuesAndOutcomes, DesireWithValuesAndOutcomesWithStringDates, validationErrorsTypes, } from '~/types/desireTypes';


export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request)
  const formData = await request.formData()
  const desireData = Object.fromEntries(formData);

  let validationErrors: validationErrorsTypes = {};
  !desireData.title && (validationErrors.title = 'A title is required')
  !desireData.description && (validationErrors.description = 'A description is required')
  if (!desireData.title || !desireData.description) return validationErrors

  let valueIds: string[] = []
  for (let key in desireData) {
    if (key.includes('value-') && desireData[key] === 'on') {
      let valueId = key.split('-')[1]
      valueIds.push(valueId)
    }
  }

  let desire = {
    id: desireData.desireId as string,
    title: desireData.title as string,
    description: desireData.description as string,
    userId,
    valueIds,
  }

  try {
    await updateDesire(desire)
    return redirect(`/dash/desires/${desireData.desireId}`)
  } catch (error) { throw error }
}

function EditDesireDetailsPage() {

  const params = useParams();
  const navigate = useNavigate();
  const loaderData = useRouteLoaderData('routes/dash.desires');

  const [desire, setDesire] = useState<DesireWithValuesAndOutcomes>();

  useEffect(() => {
    if (!loaderData.desiresWithValuesOutcomes) redirect('/dash/desires')

    const desiresWithValuesOutcomesStrDates: DesireWithValuesAndOutcomesWithStringDates[] = loaderData?.desiresWithValuesOutcomes
    const desiresWithValuesOutcomesProperDates: DesireWithValuesAndOutcomes[] = transformDesireValueOutcomeDates(desiresWithValuesOutcomesStrDates)
    const currentDesire: DesireWithValuesAndOutcomes | undefined = desiresWithValuesOutcomesProperDates?.find((desire: DesireWithValuesAndOutcomes) => desire.id === params.desireId)
    if (!currentDesire) return navigate("/dash/desires");

    setDesire(currentDesire)
  }, [loaderData, params, navigate])

  return (
    <>
      <Outlet />
      <Modal onClose={() => { }} zIndex={10}>
        <DesiresForm desire={desire} isNew={false} />
      </Modal>
    </>
  )
}

export default EditDesireDetailsPage
