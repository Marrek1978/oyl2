import { useMatches, useParams } from '@remix-run/react';

import DesiresOutcomesForm from '~/components/forms/DesiresOutcomesForm'

import type { Desire } from '@prisma/client';
import type { DesireWithValues } from '~/types/desireTypes';
import type { ActionArgs } from '@remix-run/server-runtime';

 export const action = async ({ request }: ActionArgs) => {
  console.log('in action of app.routes.dash.desires.$desireId_.outcomes._index.tsx')
  return null
}

function DesireOutcomesIndexPage() {
  const params = useParams();
  const matches = useMatches();
  const desires: DesireWithValues[] = matches.find(match => match.id === 'routes/dash.desires')?.data.desires
  const desire: DesireWithValues | undefined = desires?.find((desire: Desire) => desire.id === params.desireId)

  if (!desire) {
    return null;
  }
  
  return (
    <>
      <DesiresOutcomesForm desire={desire} />
    </>
  )
}

export default DesireOutcomesIndexPage