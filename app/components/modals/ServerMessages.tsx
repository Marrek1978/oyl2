import { useEffect, useState } from 'react';
import { useNavigate } from '@remix-run/react';

import Modal from './Modal';
import { Exclamation, closeIcon } from '../utilities/icons';
import { FailureMessageTimeout, SuccessMessageTimeout } from '../utilities/constants';


type Props = {
  fetcherState: string | undefined;
  fetcherMessage: 'success' | 'failed' | undefined;
  showLoading?: boolean;
  showSuccess?: boolean;
  showFailed?: boolean;
  successMessage?: string;
  failureMessage?: string;
}


function ServerMessages({ fetcherState, fetcherMessage, showLoading = true, showSuccess = true, showFailed = true, successMessage = 'Saved', failureMessage = 'Something went wrong' }: Props) {

  const navigate = useNavigate();
  const [message, setMessage] = useState<string>()
  const [isLoadingState, setIsLoadingState] = useState<boolean>(false)
  const [isSubmittingState, setIsSubmittingState] = useState<boolean>(false)
  const [isIdleState, setIsIdleState] = useState<boolean>(false)
  const [isSuccessMessage, setIsSuccessMessage] = useState<boolean>(false)
  const [isFailureMessage, setIsFailureMessage] = useState<boolean>(false)

  //loading
  useEffect(() => {
    setIsLoadingState(fetcherState === 'loading')
    setIsSubmittingState(fetcherState === 'submitting')
    setIsIdleState(fetcherState === 'idle')
  }, [fetcherMessage, fetcherState])

  useEffect(() => {
    if (!isIdleState) return
    if (!fetcherMessage) return

    if (fetcherMessage === 'failed') {
      setIsFailureMessage(true)
      setMessage(failureMessage);
      setTimeout(() => setIsFailureMessage(false), FailureMessageTimeout); // Clear the message after 3 seconds
      setTimeout(() => setMessage(''), FailureMessageTimeout); // Clear the message after 3 seconds    }
      setTimeout(() => window.location.reload(), FailureMessageTimeout); // Clear the message after 3 seconds    }
    }

    if (fetcherMessage === 'success') {
      setIsSuccessMessage(true)
      setMessage(successMessage);
      setTimeout(() => setIsSuccessMessage(false), SuccessMessageTimeout); // Clear the message after 3 seconds
      setTimeout(() => setMessage(''), SuccessMessageTimeout); // Clear the message after 3 seconds    }
    }

  }, [isIdleState, fetcherMessage, successMessage, failureMessage, navigate])


  const handleCloseBtn = () => {
    setMessage('')
    window.location.reload()
  }

  return (
    <>

      {isLoadingState && (
        <Modal onClose={() => { }} zIndex={20}>
          <div className="alert shadow-lg">
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> */}
            <div>
              <h3 className="font-bold">Loading</h3>
              <span className="loading loading-dots loading-lg"></span>
            </div>
          </div>
        </Modal>
      )}


      {isIdleState && showFailed && message && isFailureMessage && (
        <Modal onClose={() => { }} zIndex={20}>
          <div className="alert alert-error">
            {Exclamation}
            <span>{message}</span>
            <button className="btn btn-sm " onClick={handleCloseBtn}>Close {closeIcon}</button>
          </div>
        </Modal>
      )}


      {isIdleState && showSuccess && successMessage && isSuccessMessage && (
        <Modal onClose={() => { }} zIndex={20}>
          <div className="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{message}</span>
          </div>
        </Modal>
      )}
    </>
  )
}

export default ServerMessages