import React, { useEffect, useState } from 'react'
import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue'
import { useFetcher } from '@remix-run/react'
import { closeIcon, trashIcon } from '../utilities/icons'
import type { ScheduledList } from '@prisma/client';

interface DeleteEventModalProps {
  event: ScheduledList | Omit<ScheduledList, 'createdAt' | 'updatedAt' | 'userId'>;
  setDeleteEventBool: React.Dispatch<React.SetStateAction<boolean>>;
  setScheduledLists: React.Dispatch<React.SetStateAction<ScheduledList[] | Omit<ScheduledList, 'createdAt' | 'updatedAt' | 'userId'>[]>>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function DeleteEventModal({ event, setDeleteEventBool, setScheduledLists, setSuccessMessage }: DeleteEventModalProps) {

  const fetcher = useFetcher();
  const [idFromDB, setIdFromDB] = useState<boolean>()

  useEffect(() => {
    if (event.id.includes('-')) {
      setIdFromDB(false)
    } else {
      setIdFromDB(true)
    }
  }, [event])

  useEffect(() => {
    if (fetcher.data?.status === 'success') {
      setDeleteEventBool(false)
    }
  }, [fetcher, setDeleteEventBool])

  const handleDeleteNotFromDB = () => {
    setScheduledLists((prev) => {
      return prev.filter((scheduledList) => scheduledList.id !== event.id)
    })
    setDeleteEventBool(false)
    setSuccessMessage('List was removed from Schedule');
    setTimeout(() => setSuccessMessage(''), 1000);
  }


  const handleDeleteFromDB = async () => {
    const idToDelete = event.id
    try {
      await fetcher.submit({
        idToDelete
      }, {
        method: 'DELETE',
        action: '/dash/schedule',
      })

      setSuccessMessage('List was removed from Schedule');
      setTimeout(() => setSuccessMessage(''), 1000); // Clear the message after 3 seconds
    } catch (error) { throw error }
  }

  return (
    <>
      <div className="card w-[700px] bg-base-100 
        rounded-none
        font-mont
        shadow-xl z-30
        ">
        <div className="card-body">
          <h2 className="text-2xl  text-base-content">
            Are you sure you want to delete the list  <span className='underline'>{event.title}</span> from the schedule?<br />

          </h2>
          <p className='mt-2'>Deleting the list is permament</p>
          <div className="flex gap-6 w-full justify-between mt-8">
            <div className='w-6/12 flex gap-2 flex-1 '>
              <SolidBtnGreyBlue
                text='Cancel Delete'
                onClickFunction={() => setDeleteEventBool(false)}
                icon={closeIcon}
              />
            </div>
            <div className='flex-1'>
              {idFromDB && (
                <button
                  className="btn btn-error rounded-none w-full"
                  onClick={handleDeleteFromDB}
                >
                  Delete List  {trashIcon}
                </button>
              )}

              {!idFromDB && (
                <button
                  className="btn btn-error rounded-none w-full"
                  onClick={handleDeleteNotFromDB}  >
                  Delete List  {trashIcon}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


