import React from 'react'
import { redirect, type ActionArgs } from '@remix-run/server-runtime'

import DesiresForm from '~/components/forms/DesiresForm'
import { requireUserId } from '~/models/session.server'
import { createDesire } from '~/models/desires.server'

import type { validationErrorsTypes } from '~/types/valueTypes'

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request)
  const formData = await request.formData()
  const desireData = Object.fromEntries(formData);

  let validationErrors: validationErrorsTypes = {};
  !desireData.title && (validationErrors.title = 'A title is required')
  !desireData.description && (validationErrors.description = 'A description is required')
  if (!desireData.title || !desireData.description) return validationErrors

  let valueIds: string[] = []
  for (let key in desireData) {
    if (key.includes('value-') && desireData[key] === 'on') {
      let valueId = key.split('-')[1]
      valueIds.push(valueId)
    }
  }

  let desire = {
    title: desireData.title as string,
    description: desireData.description as string,
    userId,
    sortOrder: desireData.sortOrder ? parseInt(desireData.sortOrder as string) : 0,
    valueIds,
  }

  try {
    await createDesire(desire)
    return redirect('/dash/desires')
  } catch (error) { throw error }
}


function AddNewDesirePage() {
  return (
    <>
      <DesiresForm />
    </>
  )
}

export default AddNewDesirePage