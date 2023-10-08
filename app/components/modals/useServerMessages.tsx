import { useActionData } from '@remix-run/react';
import { useEffect, useState } from 'react';

import { toast } from 'sonner';
import { toasterBtnLabel, toasterDuration, toasterPosition } from '~/components/utilities/constants';


type Props = {
  fetcherState: string | undefined;
  fetcherMessage?: 'success' | 'failed' | undefined;
  isShowLoading?: boolean;
  loadingMessage?: string;
  isShowSubmitting?: boolean;
  submittingMessage?: string;
  isShowSuccess?: boolean;
  successMessage?: string;
  isShowFailed?: boolean;
  failureMessage?: string;
}

function useServerMessages({
  fetcherState,
  fetcherMessage,
  isShowLoading = false,
  loadingMessage = 'Loading',
  isShowSuccess = false,
  successMessage = 'Saved',
  isShowFailed = true,
  failureMessage = 'Something went wrong',
  isShowSubmitting = false,
  submittingMessage = 'Sending data to database'
}: Props) {

  const actionData = useActionData()
  const [isIdleState, setIsIdleState] = useState<boolean>(false)
  const [isLoadingState, setIsLoadingState] = useState<boolean>(false)
  const [isSubmittingState, setIsSubmittingState] = useState<boolean>(false)
  const [serverResponse, setServerResponse] = useState<string>('')

  useEffect(() => {
    fetcherMessage ? setServerResponse(fetcherMessage) : setServerResponse(actionData)
  }, [actionData, fetcherMessage])


  //loading
  useEffect(() => {
    setIsIdleState(fetcherState === 'idle')
    setIsLoadingState(fetcherState === 'loading')
    setIsSubmittingState(fetcherState === 'submitting')
  }, [fetcherState])


  useEffect(() => {
    if (!isLoadingState) return

    if (isShowLoading) {
      toast.loading(loadingMessage, {
        position: toasterPosition,
        duration: toasterDuration,
        action: {
          label: toasterBtnLabel,
          onClick: () => console.log('Close'),
        },
      })
    }
  }, [isLoadingState, isShowLoading, loadingMessage])


  useEffect(() => {
    if (!isSubmittingState) return

    if (isShowSubmitting) {
      toast.loading(submittingMessage, {
        position: toasterPosition,
        duration: toasterDuration,
        description: 'This is a description',
        action: {
          label: toasterBtnLabel,
          onClick: () => console.log('Close'),
        },
      })
    }
  }, [isSubmittingState, isShowSubmitting, submittingMessage])


  useEffect(() => {
    if (!isIdleState) return
    if (!serverResponse) return

    if (serverResponse === 'failed' && isShowFailed) {
      toast.error(failureMessage, {
        position: toasterPosition,
        duration: toasterDuration,
        action: {
          label: toasterBtnLabel,
          onClick: () => console.log('Close'),
        },
      })
    }

    if (serverResponse === 'success' && isShowSuccess) {
      toast.success(successMessage, {
        position: toasterPosition,
        duration: toasterDuration,
        action: {
          label: toasterBtnLabel,
          onClick: () => console.log('Close'),
        },
      })
    }

  }, [isIdleState, serverResponse, successMessage, failureMessage, isShowFailed, isShowSuccess])
}

export default useServerMessages