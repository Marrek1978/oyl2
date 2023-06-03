import React from 'react'


interface OutlinedBtnGoldProps {
  text:string;
  onClickFunction: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
}

function OutlinedBtnGold({ text, onClickFunction, icon  }: OutlinedBtnGoldProps) {
  return (
    <button
        className={`rounded
          border-2 border-opacity-70 px-4 py-2 border-solid border-goldText 
          font-mont font-normal  text-goldText  
        hover:bg-goldText hover:text-white hover:border-goldText`}
        type="submit"
        onClick={onClickFunction}
      >
        <div className='flex gap-2 items-center text-sm capitalize '>
          {text}
          {icon}
        </div>
      </button>
  )
}

export default OutlinedBtnGold