import { redirect, type LoaderFunctionArgs } from '@remix-run/server-runtime'
import { getDesiresAndOutcomes } from '~/models/desires.server';
import { requireUserId } from '~/models/session.server';


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let userId = await requireUserId(request);

  try {
    const desires = await getDesiresAndOutcomes(userId);
    if (!desires) redirect('/dash')

    const desireZero = desires.find(desire => desire.sortOrder === 0)
    const desireZeroId = desireZero?.id
    const outcomeZero = desireZero?.outcomes.find(outcome => outcome.sortOrder === 0)
    const outcomeZeroId = outcomeZero?.id
    return outcomeZero?.id ? redirect(`/dash/desires/${desireZeroId}/outcomes/${outcomeZeroId}`) : redirect(`../desires/${desireZero?.id}`)
  } catch (error) { return 'failure' }
}


function CurrentFocusPage() {
  return (
    <div>Redirecting to Main Focus...</div>
  )
}
export default CurrentFocusPage