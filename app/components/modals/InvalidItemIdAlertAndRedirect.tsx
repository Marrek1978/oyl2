import React, { useEffect, useState } from 'react'
import { useNavigate } from '@remix-run/react';



function useInvalidItemIdAlertAndRedirect(loaderData: any) {

  const navigate = useNavigate()
  const [warning, setWarning] = useState<string>('')
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (loaderData === null) return setWarning('That Milestone Group was NOT found!')
    if (loaderData === 'noId') return setWarning('That Milestone Group was NOT found!')
  }, [loaderData])

  useEffect(() => {
    const time = 3
    let timer: NodeJS.Timeout;
    if (warning) {
      setRemainingTime(time)
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            navigate('..')
            return 0
          }
          return prevTime - 1
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [warning, navigate])

  const alertMessage = (
    <div className="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>{warning}</span>
      <div>Redirecting back in ... {remainingTime}</div>
    </div>
  )

  return { warning, alertMessage }
}

export default useInvalidItemIdAlertAndRedirect