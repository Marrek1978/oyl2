
import PageTitle from '../titles/PageTitle'
import HeadingH1 from '../titles/HeadingH1'
import HeadingH3 from '../titles/HeadingH3'

import type { Savings } from '@prisma/client'


interface Props {
  saving: Savings
}


function SavingDisplay({ saving }: Props) {

  //get total saved from payments
  //already have required amount
  //get monthly amount and est time to completion

  //show payments


  // edit saving modal  delete too
  //edit payment modal  delete too
  //add payment form 


  return (
    <>
      <PageTitle text={'Saving'} />
      <div className='mt-2  '>
        <HeadingH1 H1Title={saving?.title} />
      </div>
      {/* Name='mt-6  '> */}
      {/* {existingStreaks && existingStreaks?.map((streakObj, index) => {
          return (<DateDisplay key={index} streakObj={streakObj} />)
        })} */}

    </>
  )
}

export default SavingDisplay