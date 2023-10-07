import { useActionData, useNavigate } from '@remix-run/react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { toasterBtnLabel, toasterDuration, toasterPosition } from './constants'

interface FormDeleteProps {
  numPathsToGoBack?: number;
}

function useFormDeletedToastAndRedirect({ numPathsToGoBack = 2 }: FormDeleteProps = {}) {

  const actionData = useActionData()
  const navigate = useNavigate()
  const isDeleted = actionData === 'deleted'

  let path: string = '';
  for (let i = 0; i < numPathsToGoBack; i++) {
    path = path ? `../${path}` : '..'
  }

  useEffect(() => {
    if (isDeleted) {
      toast.success('Value was delted', {
        position: toasterPosition,
        duration: toasterDuration,
        action: {
          label: toasterBtnLabel,
          onClick: () => console.log('Close'),
        },
      })

      navigate(path)
    }
  }, [isDeleted, navigate, path])
}

export default useFormDeletedToastAndRedirect