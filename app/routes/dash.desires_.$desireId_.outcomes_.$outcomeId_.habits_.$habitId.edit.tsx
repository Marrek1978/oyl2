import { parse } from 'querystring';
import type { ActionFunctionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/displays/modals/Modal'
import { updateHabit } from '~/models/habits.server';
import HabitForm from '~/components/forms/habits/HabitForm'
import { useGetHabit } from './dash.desires_.$desireId_.outcomes_.$outcomeId_.habits_.$habitId';



export const action = async ({ request, params }: ActionFunctionArgs) => {

  if (request.method === 'PUT') {
    const formData = await request.text()
    const parsedHabitData = parse(formData)
    if (!parsedHabitData.habitString) return 'failure'
    const habit = JSON.parse(parsedHabitData.habitString as string);

    try {
      await updateHabit(habit);
      return 'success'
    } catch (error) { return 'failure' }
  }

  return null
}


function EditHabitPage() {
  const loadedHabit = useGetHabit()

  return (
    <>
      <Modal onClose={() => { }} zIndex={10}>
        <div className='max-w-md'>
          <HabitForm isNew={false} passedHabit={loadedHabit} />
        </div>
      </Modal>
    </>
  )
}

export default EditHabitPage