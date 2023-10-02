import { useEffect, useState } from 'react';
import { ServerFailureMessage, ServerSuccessMessage } from './constants';

import type { FetcherWithComponents} from '@remix-run/react';

const string1 = ServerSuccessMessage;
const string2 = ServerFailureMessage;

type ServerResponseMessagesType = typeof string1 | typeof string2 | undefined

export interface FetcherStateProps {
  fetcher: FetcherWithComponents<any>;
}


function useFetcherState({ fetcher }: FetcherStateProps) {

  const [isIdle, setIsIdle] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetcherState, setFetcherState] = useState<string>();
  const [fetcherMessage, setFetcherMessage] = useState<ServerResponseMessagesType>();

  useEffect(() => {
    setIsSubmitting(fetcher.state === 'submitting');
    setIsLoading(fetcher.state === 'loading');
    setIsIdle(fetcher.state === 'idle');
    setFetcherState(fetcher.state);
    setFetcherMessage(fetcher.data);
  }, [fetcher.state, fetcher.data]);

  return {
    isIdle,
    setIsIdle,
    isLoading,
    setIsLoading,
    isSubmitting,
    setIsSubmitting,
    fetcherState,
    setFetcherState,
    fetcherMessage,
    setFetcherMessage
  };
}

export default useFetcherState;

