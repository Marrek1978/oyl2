import { useNavigation } from '@remix-run/react';
import { useEffect, useState } from 'react'

function useGetNavigationState() {
  const navigation = useNavigation();

  const [isIdle, setIsIdle] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [navigationState, setNavigationState] = useState<string>();

  useEffect(() => {
    setIsSubmitting(navigation.state === 'submitting');
    setIsLoading(navigation.state === 'loading');
    setIsIdle(navigation.state === 'idle');
    setNavigationState(navigation.state);
  }, [navigation.state]);

  return {
    isIdle,
    setIsIdle,
    isLoading,
    setIsLoading,
    isSubmitting,
    setIsSubmitting,
    navigationState
  };

}

export default useGetNavigationState