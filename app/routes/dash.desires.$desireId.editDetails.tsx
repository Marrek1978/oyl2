import { Outlet, useMatches, useParams } from '@remix-run/react';

import DesiresForm from '~/components/forms/DesiresForm';
import Modal from '~/components/modals/Modal';

import type { DesireWithValues, } from '~/types/desireTypes';


function EditDesireDetailsPage() {

  const matches = useMatches();
  const params = useParams();
  const desires = matches.find(match => match.id === 'routes/dash.desires')?.data.desires
  const desire = desires?.find((desire: DesireWithValues) => desire.id === params.desireId)

  return (

    <>
      <Outlet />
      <Modal onClose={() => { }} zIndex={10}>
        <DesiresForm desire={desire} />
      </Modal>
    </>
  )
}

export default EditDesireDetailsPage
