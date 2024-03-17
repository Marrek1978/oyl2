import { useActionData, useNavigate } from '@remix-run/react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { toasterBtnLabel, toasterDuration, toasterPosition } from './constants'

interface FormDeleteProps {
  redirectTo?: string
  message?: string;
  fetcherMessage? : string
}

function useFormDeletedToastAndRedirect({ redirectTo, message = 'Value was delted', fetcherMessage }: FormDeleteProps = {}) {

  const actionData = useActionData()
  const navigate = useNavigate()
  const isDeleted = fetcherMessage === 'deleted' ?? actionData === 'deleted'


  useEffect(() => {
    if (isDeleted) {
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
  }, [isDeleted, navigate, redirectTo, message])
}

export default useFormDeletedToastAndRedirect