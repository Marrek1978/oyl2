import { useMatches, useParams } from '@remix-run/react';

import DesiresCurrentForm from '~/components/forms/DesiresCurrentForm';

import type { DesireWithValues, } from '~/types/desireTypes';


function EditDesireDetailsPage() {

  const matches = useMatches();
  const params = useParams();
  const desires = matches.find(match => match.id === 'routes/dash.desires')?.data.desires
  const desire = desires?.find((desire: DesireWithValues) => desire.id === params.desireId)

  return (
    <>
      <DesiresCurrentForm desire={desire} />
    </>
  )
}

export default EditDesireDetailsPage
