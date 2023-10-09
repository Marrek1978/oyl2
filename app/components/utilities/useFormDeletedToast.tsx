import { useActionData, useNavigate } from '@remix-run/react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { toasterBtnLabel, toasterDuration, toasterPosition } from './constants'

interface FormDeleteProps {
  redirectTo?: string;
  message?: string;
}

function useFormDeletedToastAndRedirect({ redirectTo='/dash/values', message= 'Value was delted'}: FormDeleteProps = {}) {

  const actionData = useActionData()
  const navigate = useNavigate()
  const isDeleted = actionData === 'deleted'
  console.log("🚀 ~ file:  ~ isDeleted:", isDeleted)
  

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

      navigate(redirectTo)
    }
  }, [isDeleted, navigate, redirectTo,  message])
}

export default useFormDeletedToastAndRedirect