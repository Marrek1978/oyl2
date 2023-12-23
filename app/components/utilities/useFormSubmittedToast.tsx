import { useEffect } from 'react'
import { useActionData, useNavigate } from '@remix-run/react'

import { toast } from 'sonner'
import { toasterBtnLabel, toasterDuration, toasterPosition } from './constants'

interface FormDeleteProps {
  redirectTo?: string;
  message?: string;
}

function useFormSubmittedToastAndRedirect({ redirectTo, message= 'Form was successfully submitted'}: FormDeleteProps = {}) {

  const actionData = useActionData()
  const navigate = useNavigate()
  const isSuccess = actionData === 'success'

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
  }, [isSuccess, navigate, redirectTo,  message])
}

export default useFormSubmittedToastAndRedirect