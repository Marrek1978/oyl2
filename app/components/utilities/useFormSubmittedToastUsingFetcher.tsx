import { useEffect } from 'react'
import { type FetcherWithComponents, useNavigate } from '@remix-run/react'

import { toast } from 'sonner'
import { toasterBtnLabel, toasterDuration, toasterPosition } from './constants'
import useFetcherState from './useFetcherState';

interface FormDeleteProps {
  fetcher: FetcherWithComponents<any>;
  redirectTo?: string;
  message?: string;
}

//?    place on forms -> not routes
function useFormSubmittedToastUsingFetcher({ fetcher, redirectTo = '../', message = 'Form was Updated' }: FormDeleteProps) {

  const navigate = useNavigate()
  const { fetcherMessage } = useFetcherState({ fetcher })
  const isSuccess = fetcherMessage === 'success'

  useEffect(() => {
    if (isSuccess) {
      toast.success(message, {
        position: toasterPosition,
        duration: toasterDuration,
        action: {
          label: toasterBtnLabel,
          onClick: () => console.log('Close'),
        },
      })

      if (redirectTo) navigate(redirectTo)
    }
  }, [isSuccess, navigate, redirectTo, message])
}

export default useFormSubmittedToastUsingFetcher