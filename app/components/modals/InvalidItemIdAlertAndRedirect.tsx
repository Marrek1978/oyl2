import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from '@remix-run/react';

interface Props {
  loaderData: any;
  goBackXPaths?: number;
  itemType?: string
}


// if the loaderData is set to null, this triggers the alert message
function useInvalidItemIdAlertAndRedirect({ loaderData, goBackXPaths = 1, itemType = 'Item' }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const [warning, setWarning] = useState<string>('')
  const [remainingTime, setRemainingTime] = useState(0);

  const locationArray = location.pathname.split('/')
  locationArray?.splice(-goBackXPaths)
  const path = locationArray.join('/')

  const time = 3

  useEffect(() => {
    setWarning('');
    setRemainingTime(0);
  }, [location.pathname]);

  useEffect(() => {
    if (loaderData === null || loaderData === 'noId' && !warning) {
      setWarning(`That ${itemType} was NOT found!`)
      setRemainingTime(time)
    }
  }, [loaderData, warning, itemType])

  useEffect(() => {
    if (remainingTime <= 0) return;
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          setTimeout(() => {
            navigate(path)
          }, 0)
          return 0
        }
        return prevTime - 1
      });
    }, 1000);

    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [remainingTime, navigate, path])


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