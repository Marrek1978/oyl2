import { useEffect, useState } from 'react';
import Modal from '~/components/modals/Modal'
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal';
// import useFormDeletedToastAndRedirect from '~/components/utilities/useFormDeletedToast';

// import type { ActionArgs } from '@remix-run/server-runtime';
// import { deleteList } from '~/models/list.server';
import { useGetCurrentList } from '~/routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.lists.$listId';
// import { parse } from 'querystring';
// import { useParams } from '@remix-run/react';

function DeleteList() {


  
  const loadedList = useGetCurrentList()
  const [id, setId] = useState<string>('')
  const [title, setTitle] = useState<string>('')

  
  useEffect(() => {
    if (!loadedList) return
    setId(loadedList.id)
    setTitle(loadedList.title)
  }, [loadedList])




  return (
    <>
    <Modal onClose={() => { }} zIndex={20}>
      < AreYouSureDeleteModal
        item={'To-Do List'}
        title={title}
        id={id}
      />
    </Modal>
  </>
  )
}

export default DeleteList