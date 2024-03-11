import { Form } from '@remix-run/react'
import React from 'react'
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG'
import { MaslowsNeeds } from '~/utils/MaslowsNeeds'



function MaslowPage() {

  const maslowsNeeds = MaslowsNeeds

  const formInputs = maslowsNeeds.map((need, index) => {

    return (
      <div key={index}>
        <label className="label pl-0 " htmlFor={need.name} >
          <span className="label-text " >{need.name}</span>
        </label>
        <input
          id={need.name}
          required
          autoFocus={true}
          name={need.name}
          type="text"
          autoComplete="text"
          placeholder={need.name}
          className="input input-bordered w-full max-w-xs rounded-none"
        />
      </div>
    )
  })




  return (
    <>
      <BasicTextAreaBG pageTitle="Maslow's Hierarch of Needs">
        <Form className="space-y-6 mt-6 form-control w-full max-w-xs font-mont">
          <div>Create form inputs in loop</div>
        {formInputs}



        </Form>
      </BasicTextAreaBG >
    </>


  )
}

export default MaslowPage